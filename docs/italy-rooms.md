# Italy rooms: the wide and portrait motion matrix

This is the Room maker's Stage C record for the thirteen painted rooms of the Italy world (areas `rome`, `venice`,
`sicily`). It covers `src/fw/scenes-italy.ts` (`ITALY_SCENES`), `src/fw/italy-ambience.ts` (`ITALY_AMBIENCE` and
`ITALY_HUNG`) and the thirteen `it_` entries in `PAINTED_SIGNATURES` inside `src/fw/scene-ambience.ts`. The room
list, the sprite per room and the hot-and-cold rules come from "Shared contract: rooms" in
[italy-world.md](italy-world.md) and its Stage B acceptance table. The three discovery subjects and their texts are
`ITALY_DISCOVERIES` in `src/fw/italy-stories.ts`, word for word; this file supplies only the effect and the two
anchors per touch.

Every coordinate in both files was read off the delivered file at that orientation, on a gridded crop of its own
pixels (the full frame at a .05 grid first, then a .005 or .01 grid at up to 10x for every pour, every hook and every
fire). No wide fraction was converted into a portrait one. The wide painting is 1672 x 941 and maps to stage units as
`x = fx * 1600`, `y = fy * 900`. The portrait painting is 941 x 1672 and goes through `pAt(folder, fx, fy)`.

**The phone band.** A 390-wide viewport shows x .094 to .906 of a portrait painting. Every portrait patch box, every
portrait sprite and every portrait touch anchor lies inside it. One painted fitting sits outside it — the casale peg
at x .900 — and that room hangs nothing in portrait.

**What the room heading covers.** Measured on the live page from the text itself (a `Range` over each glyph run, not
the block box). At 1280 x 720 the Back button is x 18 to 191, y 16 to 52; the room's name runs y 63 to 102 and its
title y 97 to 138 from x 28 to between 115 and 253 depending on the room (the trattoria's title ends at 208, Campo
de' Fiori's at 253); the story button is x 28 to 131, y 146 to 179. In painting fractions that is roughly x .02 to
.20, y .09 to .19, and nothing Italian may hang there. At 390 x 844 the heading is one line, y 64 to 94 (fy .076 to
.111), from x 16 to between 202 and 322, and the story button is x 16 to 119, y 110 to 143 (fx .127 to .342, fy .130
to .169). Three wide hooks fall inside the wide block (trattoria, market, Pescaria) and hang nothing there.

## How to read the matrix

One row per room and orientation. Dominant cue names the room's `PAINTED_SIGNATURES` entry. Supporting cues are the
`ITALY_AMBIENCE` patches, the `ITALY_HUNG` sprites, the steam, the fire and the pot. Visibility is the share of the
frame that visibly changes in two seconds (`|ΔR|+|ΔG|+|ΔB| > 24`), the median of four pairs phased across the drift
cycle at frame offsets 60, 130, 200 and 270, with the weakest and strongest pair. The ten rooms re-measured after the
walkthrough fixes of 2026-09-23 carry the median of six pairs instead, spread across the whole 22.4 s cycle of the
beams' drift (see "Fixes from the walkthrough, 2026-09-23"); those cells say so. Wide at 1280 x 720, portrait at
390 x 844. Lit pixels are read off the room's own effect canvas inside each configured box, the maximum over 108
stepped frames, in canvas pixels. Sprite boxes are screen pixels from the DOM.

### The trattoria, `it_trattoria` (hot)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The ringed glass foglietta pouring into a tumbler on the marble, the open oxtail pot, two pasta bowls and the grilled chops, the open firebox of the range, the piazza door at the right, an empty iron hook on the lime wash at the upper left | The same pour and dishes, the range at the left, the hook at x .42 |
| Boundary | Signature glint [.446, .506, .478, .597]; steam (.675, .600) 240, (.50, .70) 180, (.42, .665) 150, (.67, .745) 140; fire (.331, .462) rx 34 ry 16; sunray [.56, 0, .90, .70] | Signature [.456, .450, .498, .512]; steam (.62, .565) 200, (.33, .68) 170, (.22, .61) 140; fire (.147, .322) rx 24 ry 14; nothing hung (since 2026-09-23) |
| Anchor | Lip (.4535, .510), through (.460, .545) and (.4655, .572), surface in the tumbler (.469, .597) | Lip (.4645, .450), through (.474, .480) and (.481, .498), surface (.487, .512); the hook's J at (.424, .078) stays empty |
| Forbidden overlap | The oste's hand on the carafe, the glass above the lip, the tumbler below the wine surface; the cut pecorino, bread and wine stay dry | The same; the diners' held tumblers stay dry |
| Dominant cue | The wine poured from the foglietta, traced lip to surface | The same pour |
| Supporting cues | Steam off four dishes, the firebox, the piazza daylight | Steam off three dishes, the firebox |
| Visibility | 7.20 (5.3 to 8.0) | 14.05 (12.9 to 15.3) |
| Browser status | Glint box 11,256 lit (the tomato pasta's plume rises through it), sunray 384,771. No sprite: see below | Glint 4,494. No sprite |

**The wide hook hangs nothing.** Its J is at (.136, .100). A salumi hung from it drew at screen x 136 to 191, y 66 to
267, and ran behind the end of the title "The trattoria" (glyphs to x 208, y 97 to 138). The wide composition spends
that loop on the piazza door's daylight instead. The portrait salumi came out on 2026-09-23: hung from the J at
(.424, .078) it ran down to y .27 and across the oste's face (walkthrough 34). The portrait runs on three loops.

### Campo de' Fiori, `it_market` (cold)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The artichoke turned against the knife, the drained ricotta baskets, the brass balance, Bruno's statue, the sky over the palazzi, a young tree left of the plinth, an empty S-hook on the stall rail at the upper left | The same three subjects, a larger tree over the left stalls, the sky right of the statue, the S-hook at x .342 |
| Boundary | Signature sunray [.36, 0, .90, .72]; birds [.60, .02, .90, .14] and [.40, .02, .56, .10]; leaves [.53, .16, .605, .27] | Signature [.28, 0, .88, .56], drift .12; birds [.56, .115, .90, .19]; leaves [.10, .17, .30, .235]; nothing hung (since 2026-09-23) |
| Anchor | Nothing hot: no steam, no fire | The S-hook's bend (.342, .102) stays empty |
| Forbidden overlap | The stall greens and chicory crates are not foliage and carry no leaves | The canvas awning over the top-left, which the first birds box sat on and was moved off |
| Dominant cue | Winter sun across the Campo | The same |
| Supporting cues | Two flocks, the leaves of the plinth tree | One flock, the tree's leaves |
| Visibility | 4.20 (0.4 to 5.5) | 4.90 (3.0 to 7.9) |
| Browser status | Sunray 266,595, birds 25,870 and 29,589, leaves 31,590 | Sunray 128,350, birds 18,631, leaves 2,077 |

**The weakest sprite placement in the world.** The wide hook's bend is at (.132, .127) and an awning hung from it sat
squarely behind both lines of the title, so the wide hangs nothing and takes a second flock. The portrait awning was
kept at Stage C with its top behind the heading's name and its corner behind the story button; the walkthrough
(item 39) ruled that nothing may hang in either, so it came out on 2026-09-23 and the portrait's sun drift went from
.08 to .12 to carry the loop.

### The pasta kitchen, `it_pasta` (hot)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The folded sheet under the knife, the lifted ribbons, the guitar frame, the tall window at the left, the open copper on the range, the bare cane between two iron brackets | The same; cane with brackets at .465 and .790 |
| Boundary | Signature sunray [.03, 0, .46, .80] angles -.42; steam (.255, .19) 150; fire (.262, .315) rx 34 ry 14; hung `it-pasta-cane` fx .50 fy .047 fw .11 (since 2026-09-23) | Sunray [.10, 0, .48, .60] angle -.38; steam (.215, .265) 140; fire (.225, .425) rx 26 ry 14; hung fx .52 fy .150 fw .25 |
| Anchor | The sprite's cane on the left half of the painted cane (.47 to .73, y .045 to .050); the nests end at x .61, y .117, clear of the lifted ribbons (x .60 to .70, from y .24) | The painted cane (.43 to .83, y .150 to .156) |
| Forbidden overlap | The woman's head at x .68 to .76 (the sprite stops at .69); the sheet, ribbons, flour and eggs are cold | The man's head at y .25 (the sprite ends at .25) |
| Dominant cue | The window's shaft, falling down to the right | The same |
| Supporting cues | Copper steam, fire, the pasta cane | The same |
| Visibility | 5.45 (3.5 to 7.8) | 6.30 (4.6 to 7.6) |
| Browser status | Sunray 396,719; cane at x 640 to 782, y 30 to 132 | Sunray 183,017; cane at x 204 to 325, y 123 to 210 |

Two corrections from the live look: the portrait cane had been read at x .25 to .55 off the dense full-frame grid and
hung in the air left of the rod, and both sunrays leaned the wrong way for a window on the left. Both re-measured.

### The forno, `it_forno` (hot, no sprite)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The long white pizza on the peel, the open glowing oven mouth, the cut loaf, the tomato sheet cooling, the street door at the left, an empty iron hook beside the oven | The same, oven mouth at x .72 to .90 |
| Boundary | Signature light [.60, .22, .76, .40]; steam (.60, .44) 220, (.36, .685) 200, (.77, .73) 150; fire (.667, .325) rx 62 ry 26; sunray [.02, 0, .24, .74] | Light [.71, .22, .90, .37]; steam (.60, .42) 180, (.35, .575) 170, (.62, .775) 130; fire (.805, .295) rx 34 ry 20; sunray [.10, .02, .32, .56] |
| Forbidden overlap | The cherry tart, flour and herbs stay dry; the painted hook stays empty | The same |
| Dominant cue | The oven mouth's light | The same |
| Supporting cues | Steam off the peel, the counter and the loaf; the flame; the street door's light | The same |
| Visibility | 6.33 (5.14 to 7.21) | 16.71 (16.32 to 18.49) |
| Browser status | Light 93,343, sunray 141,399 | Light 42,533, sunray 89,365 |

The room contract gives the forno no sprite, so its painted hook at (.82, .10) wide and (.355, .13) portrait stays
empty. The street-door sunray's angle was reversed after the live look, to fall away from a door on the left.

### The casale, `it_casale` (cold)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | Whey running off the draining table's cloth lip into the pail, which draws its own ring; cut curd in the copper; the cut wheel; the door onto the Agro Romano; the olive beside it; an empty wooden peg on the lime wash | The same, the peg at x .893 to .905 |
| Boundary | Signature `drip` [.486, .582, .512, .763], period 1.4, splash on; sunray [.56, 0, .86, .72], drift .15; leaves [.70, .065, .805, .235] (8, size 1.6); hung `it-garlic-braid` fx .838 fy .095 fw .036 | Drip [.573, .525, .611, .622], splash on; sunray [.30, 0, .70, .52]; leaves [.70, .085, .795, .20]; birds [.60, .065, .795, .115] |
| Anchor | Lip (.494, .582), through (.4995, .620) and (.5005, .700), surface in the pail (.5015, .763) | Lip (.5815, .525), through (.589, .560) and (.596, .600), surface (.601, .622) |
| Forbidden overlap | **No steam source and no fire anywhere.** The copper holds cold curd | The same |
| Dominant cue | Whey dripping into the pail | The same |
| Supporting cues | Door light, olive leaves, the garlic braid on the peg | Door light, olive leaves, birds over the hills |
| Visibility | 3.80 (0.9 to 4.4) | 4.15 (0.9 to 5.5) |
| Browser status | Drip 411, sunray 193,084, leaves 51,881; braid at x 1077 to 1124, y 65 to 159 | Drip 270, sunray 77,490, leaves 4,568, birds 8,032 |

The portrait peg's tip is at x .900; a braid wide enough to read would cross .906, so the portrait hangs nothing, as
the Stage B note asked. Both cells measured 2.0 on the first pass and were strengthened (below).

### The Pescaria, `it_pescaria` (cold)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | Sardines tipped along the wet marble, crates of green crabs, cuttlefish, the iron canopy, the lagoon, an empty hook on a cast-iron column | The same |
| Boundary | Signature sunray [.46, 0, .90, .62], drift .14; mist [.525, .14, .585, .34] alpha .42; birds [.62, .09, .88, .18] (period 6, scale 1.6); hung `it-gull` fx .53 fy .085 fw .07 | Sunray [.44, .02, .88, .50], drift .16; mist [.48, .19, .655, .285]; birds [.35, .10, .62, .18]; gull fx .55 fy .125 fw .12 |
| Forbidden overlap | Nothing on the fish, the marble or any face: the haze keeps to the water and the far quay between the old man's cap and the girl's headscarf; no steam | The same; the haze stops above the fishmonger's cap and the old man's |
| Dominant cue | First light down the canopy | The same |
| Supporting cues | Lagoon haze, distant gulls, the gliding gull | The same |
| Visibility | 4.05 (0.5 to 4.5) | 3.70 (0.4 to 4.5) |
| Browser status | Sunray 211,290, mist 22,908, birds 30,130; gull at x 679 to 770, y 58 to 131 | Sunray 86,171, mist 20,441, birds 3,559; gull at x 218 to 277, y 101 to 149 |

The column hook (bend at (.225, .115)) is inside the wide heading block and stays empty; the gull flies, it does not
hang. The portrait gull was lowered to fy .125 to clear the heading line.

### The osteria, `it_bacaro` (cold)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | Wine drawn from the cask's brass tap into a small glass, six cold dishes, a lit oil lamp on the shelf, the canal door, an empty brass chain and ring over the counter | The same |
| Boundary | Signature glint [.174, .440, .198, .588]; light [.53, .225, .60, .32]; sunray [.52, 0, .98, .74]; hung `it-lamp` fx .475 fy .091 fw .05 | Glint [.189, .448, .212, .546]; light [.49, .235, .56, .315]; sunray [.50, .02, .90, .60]; nothing hung (since 2026-09-23) |
| Anchor | Tap (.1805, .440), through (.186, .500) and (.189, .550), wine in the glass (.1905, .588); the lamp's ring on the painted ring at (.500, .093) | Tap (.1955, .448), through (.199, .490), (.2025, .520), surface (.2045, .546); ring (.4975, .086) |
| Forbidden overlap | No steam: stockfish, sardines in saor, octopus and wine are all cold | The same |
| Dominant cue | The ombra drawn from the cask | The same |
| Supporting cues | The oil lamp, the canal door's light, the unlit hung lamp | The oil lamp, the canal door's light |
| Visibility | 5.70 (0.5 to 7.2) | 4.30 (1.0 to 5.8) |
| Browser status | Glint 464, light 18,088, sunray 300,964; lamp at x 608 to 672, y 62 to 175 | Glint 387, light 6,622, sunray 83,837; no sprite (the lamp's chain had crossed the heading line) |

### The lagoon kitchen, `it_laguna` (hot)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | A soft crab lifted dripping out of the beaten egg, which draws its own ring; the floating cage at the step; halved artichokes; the copper of rice, the pan of fish and the polenta; the hearth; the canal through the door; an empty iron hook | The same; the cage at x .049 to .200, the hook at (.598, .195) |
| Boundary | Signature `drip` [.633, .505, .652, .682], period 1.4, splash on; steam (.91, .475) 180, (.88, .62) 160, (.51, .745) 150, (.89, .87) 170; fire (.885, .795) rx 55 ry 20; mist [.03, .30, .185, .46] | Drip [.596, .425, .616, .508]; steam (.83, .405) 150, (.82, .505) 140, (.52, .625) 130, (.87, .69) 110; fire (.858, .60) rx 30 ry 16; hung `it-gull` fx .13 fy .178 fw .11 |
| Anchor | Crab's underside (.6395, .505), through (.6415, .550), (.6425, .620), egg surface (.6435, .682) | Underside (.6035, .425), through (.605, .460), (.607, .490), surface (.6085, .508). The cage's touch sits on its right portion at (.165, .435), inside the band, per the owner ruling |
| Forbidden overlap | The egg, the crab, the artichokes, the small fish and the biscuits stay dry; the canal haze stops short of the boy's cap | The same |
| Dominant cue | Egg falling back off the crab | The same |
| Supporting cues | Steam off four vessels (the rice copper, the fish pan, the polenta and the bowl of rice and peas), the hearth, haze on the canal | The same four plumes, the hearth, the gull over the canal |
| Visibility | 6.65 (6.2 to 7.3) | 15.35 (12.9 to 18.0) |
| Browser status | Drip 402, mist 41,824, rice-and-peas plume 80,054 (box [.82, .70, .96, .86]) | Drip 2,860, rice-and-peas plume 24,037 (box [.80, .55, .906, .70]); gull at x 17 to 70, y 147 to 190 |

The assigned sprite is a gull, which flies; the painted hook stays empty in both. The wide painting's only sky is the
top-left corner under the heading, so the gull flies in the portrait alone. It was first placed at fy .122 and drew
over the story button; it now crosses in front of the Burano house fronts below it.

### The farm kitchen, `it_veneto` (hot)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | Polenta turning in the copper over the fire, the hanging copper of beans, the stew, the board with the thread, split chicory, a second bare chain with an empty S-hook; the salami on the beam is painted and still | The same |
| Boundary | Signature light [.80, .70, .99, .88]; steam (.80, .615) 260, (.885, .415) 140, (.615, .78) 160; fire (.885, .80) rx 70 ry 26; pot (.80, .625) rx 110 ry 22; hung `it-garlic-braid` fx .5665 fy .110 fw .035 | Light [.70, .55, .90, .68]; steam (.73, .49) 230, (.79, .29) 130, (.55, .80) 160; fire (.82, .61) rx 38 ry 20; pot (.73, .505) rx 80 ry 16; braid fx .428 fy .150 fw .07 |
| Dominant cue | The hearth's glow | The same |
| Supporting cues | Three plumes, the fire, the polenta surface folding, the braid | The same |
| Visibility | 6.79 (6.65 to 7.40) | 19.33 (16.29 to 19.62) |
| Browser status | Light 89,054; braid at x 722 to 771, y 75 to 169 | Light 33,743; braid at x 160 to 194, y 123 to 191 |

The snowy window at the upper left would take a `snow` patch, but the room is at four loops with the braid, and the
wide window is under the heading.

### The friggitoria, `it_friggitoria` (hot)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | Chickpea squares sliding into the lard, the copper of spleen, the second pan, the charcoal under the pan, the lane, an empty iron hook on the stone jamb | The same, hook at (.710, .132) |
| Boundary | Signature sunray [.10, 0, .46, .72]; steam (.74, .615) 230, (.16, .555) 240, (.91, .50) 140; fire (.735, .765) rx 60 ry 18; pot (.74, .655) rx 130 ry 22; nothing hung (since 2026-09-23) | Sunray [.12, .02, .46, .52]; steam (.76, .515) 200, (.12, .475) 220; fire (.765, .605) rx 34 ry 16; pot (.76, .545) rx 90 ry 16; nothing hung |
| Dominant cue | Hard sun down the lane | The same |
| Supporting cues | The lard and the spleen steaming, the charcoal, the lard's surface | The same |
| Visibility | 8.15 (7.1 to 10.4) | 12.55 (10.7 to 14.3) |
| Browser status | Sunray 342,030; no sprite | Sunray 151,754; no sprite |

### Ballarò, `it_ballaro` (cold)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | Water thrown from a bucket across the swordfish, wild fennel, a board of tomato estratto, the palm, the sky, an empty hook on the cane frame | The same, hook at (.503, .098) |
| Boundary | Signature glint [.312, .375, .470, .535]; sunray [.40, 0, .84, .60]; birds [.62, .04, .86, .14]; leaves on the palm [.70, .03, .80, .19] (8, size 1.6); nothing hung (since 2026-09-23) | Glint [.282, .392, .400, .478]; sunray [.22, 0, .86, .56]; birds [.52, .005, .76, .07]; leaves on the palm [.76, .04, .90, .19] (8, size 1.6) |
| Anchor | Bucket rim (.318, .375), through (.375, .445) and (.420, .490), onto the flank (.455, .530) | Rim (.288, .392), through (.335, .425) and (.365, .455), flank (.385, .478) |
| Forbidden overlap | Nothing cooked, nothing steams | The same |
| Dominant cue | The morning water over the slab | The same |
| Supporting cues | Sun, birds, the palm | Sun, birds, the palm |
| Visibility | 3.45 (0.4 to 4.2) | 5.75 (1.1 to 8.1) |
| Browser status | Glint 818, sunray 188,893, birds 36,353, leaves 33,294 | Glint 6,287, sunray 141,734, birds 16,225, leaves 12,472 |

The portrait hook's bend at y .098 is on the heading line, so the portrait hangs nothing. Since 2026-09-23 the wide
hangs nothing either: the awning on its chain read as a striped cloth dangling in the sky (walkthrough 36).

### The pasticceria, `it_pasticceria` (cold)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | Ricotta piped into a shell, the cut cassata, the ice tub with its crank, a lit oil lamp on the shelf, the doorway onto the bay, an empty brass chain and ring | The same |
| Boundary | Signature sunray [.56, 0, .95, .76], drift .15; light [.075, .115, .115, .175]; birds [.80, .13, .94, .22]; hung `it-lamp` fx .48 fy .09 fw .05 | Sunray [.46, .02, .90, .62], drift .15; light [.085, .105, .135, .165]; birds [.72, .13, .90, .21]; nothing hung (since 2026-09-23) |
| Forbidden overlap | **No steam anywhere**: ricotta, almond, candied fruit and ice | The same |
| Dominant cue | The doorway's daylight | The same |
| Supporting cues | The oil lamp, birds over the bay, the unlit hung lamp | The oil lamp, birds over the bay |
| Visibility | 4.60 (2.1 to 5.8) | 3.60 (2.4 to 5.6) |
| Browser status | Sunray 271,400, light 6,522, birds 28,077; lamp at x 614 to 679, y 61 to 175 | Sunray 89,323, light 3,160, birds 14,101 |

The painted oil lamp at the upper left is under the wide heading, so its `light` patch reads in the gaps of the text
only; it is the patch the room would lose first.

### The tonnara kitchen, `it_tonnara` (hot)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | A loin lowered into one of three boiling open coppers, oil poured from a copper jug into an open tin, the pressed roe, the sea through the arches, an empty iron hook in the arch | The same |
| Boundary | Signature glint [.853, .525, .875, .652]; steam (.27, .545) 250, (.44, .545) 230, (.655, .545) 220; pot (.44, .565) rx 110 ry 20; no fire; sunray [.55, 0, .90, .58]; hung `it-gull` fx .62 fy .04 fw .07 | Glint [.851, .618, .873, .681]; steam (.10, .505) 180, (.30, .49) 200, (.55, .49) 190; pot (.30, .505) rx 90 ry 16; `fire: []`; sunray [.52, .02, .88, .42]; gull fx .40 fy .13 fw .14 |
| Anchor | Jug lip (.8595, .525), through (.8665, .580) and (.868, .620), oil in the tin (.8685, .652) | Lip (.8575, .618), through (.863, .650), (.866, .670), surface (.867, .681) |
| Forbidden overlap | The coppers are set in masonry and no flame is pictured, so no fire ellipse; the roe, cooled loins and tins are dry | The same |
| Dominant cue | The oil into the tin | The same |
| Supporting cues | Three plumes, the boil, the coast's sun, the gull over the sea | The same |
| Visibility | 7.16 (6.42 to 8.14) | 11.89 (11.59 to 13.62) |
| Browser status | Glint 403, sunray 276,916; gull at x 791 to 886, y 23 to 101 | Glint 249, sunray 109,841; gull at x 147 to 214, y 106 to 161 |

## Loop counts

`LOOPS_SHOW='^it_' node scripts/tests/room-loops.mjs` puts every room at three or four always-on loops in both
orientations. The engine keeps `3 - heat - flyers` patches, so the fire-and-steam rooms without a patch (`it_pasta`,
`it_veneto`) run signature, steam, fire and sprite; the cold rooms run signature, two or three patches and a sprite
where one can hang. Since the walkthrough fixes of 2026-09-23 six orientations run on three: the trattoria portrait
(pour, steam, firebox), the friggitoria in both (sun, steam, charcoal, with the lard's surface moving in its pan),
and the market, osteria and pasticceria portraits (the sprite that made their fourth loop hung inside the heading).
Each clears its floor on motion (below).

## Hot and cold

Seven rooms steam: the trattoria (four dishes wide, three portrait), the pasta kitchen (the copper), the forno (peel,
counter, loaf), the lagoon kitchen, the Veneto kitchen, the friggitoria and the tonnara. Six never steam and carry no
fire: the casale, the market, the Pescaria, the osteria, Ballarò and the pasticceria. The tonnara steams without a
fire, because no flame is pictured. Frying lard and the boiling polenta and tuna coppers each carry a `pot` ellipse.
The casale's whey and the crab's egg are `drip`s with a splash ring, because both paintings draw the ring.

## Breeze masks

None. Every hanging motion is a delivered `it-*` sprite over clean wall, cane, chain or sky.

## Sprites

| Sprite | Hung in | Not hung, and why |
| --- | --- | --- |
| `it-salumi` | Nowhere since 2026-09-23 | Trattoria wide: hook under the heading. Trattoria portrait: it hung across the oste's face |
| `it-awning` | Nowhere since 2026-09-23 | Market wide and Ballarò portrait: hook under the heading. Market portrait: inside the heading block. Friggitoria both and Ballarò wide: a scrap on one hook or on a chain reads as a flag in the sky |
| `it-pasta-cane` | `it_pasta` both | — |
| `it-garlic-braid` | `it_casale` wide, `it_veneto` both | Casale portrait: peg at x .900 |
| `it-gull` | `it_pescaria` both, `it_laguna` portrait, `it_tonnara` both | Laguna wide: no sky outside the heading |
| `it-lamp` | `it_bacaro` wide, `it_pasticceria` wide | Both portraits: the ring is inside the heading block and the chain crossed the room's name |

Four of the six sprites are used. `it-salumi` and `it-awning` came out with the walkthrough fixes of 2026-09-23 (see
below): neither has a painted fitting clear of a face, the heading and open sky. The forno has none by contract.

## Measured motion

Captured on 2026-09-22 on the dev server at `http://localhost:5180`, by driving `openLivingScene` directly from
`ITALY_SCENES` in a host sized 1280 x 720 or 390 x 844, ticked by hand at 1/60 s. Other agents were editing files
during the whole pass and every Vite page was being full-reloaded under the capture, so the room engine was run in a
tab opened on a plain image URL (`/public/scenes/it_concept.jpg`), where the modules are imported without the Vite
client and nothing reloads the page. The composite sets `width` and `height` on each SVG clone before serialising, as
the Vietnam record describes. Pairs are saved as `.data/it-motion/rm-IT<w|p>-<room>-<offset>-<a|b>.jpg`, and
`uv run --with pillow --with numpy scripts/audit/room-motion.py .data/it-motion 2.5` reproduces the per-pair numbers.

| Room | Wide median (range of four) | Portrait median (range of four) | Floor |
| --- | --- | --- | --- |
| `it_trattoria` | 7.20 (5.3 to 8.0), six pairs, 2026-09-23 | 14.05 (12.9 to 15.3), six pairs | 3% |
| `it_market` | 4.20 (0.4 to 5.5), six pairs | 4.90 (3.0 to 7.9), six pairs | 3% |
| `it_pasta` | 5.45 (3.5 to 7.8), six pairs | 6.30 (4.6 to 7.6), six pairs | 3% |
| `it_forno` | 6.33 (5.14 to 7.21) | 16.71 (16.32 to 18.49) | 3% |
| `it_casale` | 3.80 (0.9 to 4.4), six pairs | 4.15 (0.9 to 5.5), six pairs | 3% |
| `it_pescaria` | 4.05 (0.5 to 4.5), six pairs | 3.70 (0.4 to 4.5), six pairs | 3% |
| `it_bacaro` | 5.70 (0.5 to 7.2), six pairs | 4.30 (1.0 to 5.8), six pairs | 3% |
| `it_laguna` | 6.65 (6.2 to 7.3), six pairs | 15.35 (12.9 to 18.0), six pairs | 3% |
| `it_veneto` | 6.79 (6.65 to 7.40) | 19.33 (16.29 to 19.62) | 3% |
| `it_friggitoria` | 8.15 (7.1 to 10.4), six pairs | 12.55 (10.7 to 14.3), six pairs | 3% |
| `it_ballaro` | 3.45 (0.4 to 4.2), six pairs | 5.75 (1.1 to 8.1), six pairs | 3% |
| `it_pasticceria` | 4.60 (2.1 to 5.8), six pairs | 3.60 (2.4 to 5.6), six pairs | 3% |
| `it_tonnara` | 7.16 (6.42 to 8.14) | 11.89 (11.59 to 13.62) | 3% |

Every cell clears 3 per cent on the median. The Stage E review re-measured `it_casale` wide at 2.45 (four pairs, all
in the first five seconds, near the beam's first turning point); the fixes below lift it to 3.80 on six pairs spread
over the whole cycle. Five cells did not on the first pass:

| Cell | First pass | Now | What changed |
| --- | --- | --- | --- |
| `it_casale` wide and portrait | 2.02, 2.01 | 3.08, 3.53 | Door sunray widened and its drift raised to .11; olive leaves to eight at 1.6; portrait birds to scale 1.6 every 6 s; drip period 1.8 to 1.4 |
| `it_bacaro` wide and portrait | 2.20, 1.06 | 4.25, 4.43 | The canal door's beam widened to the whole right half and its drift to .11; the lamp's light box taken out to its halo |
| `it_pasticceria` wide and portrait | 2.27, 2.22 | 4.99, 4.83 | Doorway beam widened, drift .11; birds scale 1.6 every 6 s |
| `it_ballaro` portrait | 2.20 | 5.06 | Beam widened to [.22, 0, .86, .56]; palm leaves to eight at 1.6; birds 1.6 every 6 s |

**One weak phase.** In the three cold rooms that sign or lean on a sunray (`it_casale`, `it_bacaro`, `it_ballaro`),
the pair at offset 270 falls under 2.5 (0.8 to 1.7) in both orientations: the beam's drift is a slow sine and that
pair lands on its turning point, where the light stands nearly still for two seconds. The median clears the floor,
as `vn_bread_pate`'s did with the same pattern.

## Every cue draws, and draws where a phone can see it

Every signature and every patch lights pixels on the room's own effect canvas in every orientation it declares
(figures per room above). The smallest are the thin pours and drips, 249 to 821 canvas pixels, which is what a two-
pixel dashed highlight down a painted thread of 60 to 130 pixels lights; the portrait Pescaria birds (409) are the
smallest patch. Every hung sprite draws a box of positive size inside the frame. Every portrait anchor is inside x
.094 to .906; one touch (`it_friggitoria`'s spleen copper) sat at screen x 15 and was moved in to fx .175.

The pours and drips were cropped out of the live composites and each highlight stays on its painted stream, from the
lip to the surface: nothing on the glass of the carafe or jug above the lip, nothing below the wine, whey, egg or oil.

## Reduced motion

Not verified in this pass. The engine code paths are shared with Spain, Thailand and Vietnam; no Italy-specific
behaviour exists to test.

## What is not verified

- **Reduced motion**, as above.
- **A continuous watch in a displayed pane at full size.** The rooms were watched in a Browser tab emulating 1280 x
  720 and read through composites at both sizes; a twenty-second watch of every room at 390 x 844 in a displayed
  pane was not done.
- **The world route.** No room was opened by clicking its object with `__fw.open`; the rooms were built directly.
- **The touch reactions.** `prop-reactions.mjs` and `room-controls.mjs` pass, but no Italy touch was clicked live.
- **The heading overlaps in portrait** for the trattoria salumi, both lamps and the market awning were judged from
  measured boxes and composites without the HTML heading drawn on them, not from a phone screenshot.

## Fixes from the walkthrough, 2026-09-23

A fix agent (Room maker's files only) worked the room items of "Owner walkthrough (second reviewer), 2026-09-23" in
[italy-world.md](italy-world.md), items 32 to 46, and the failed room lines R3, R11 and R13 of the Stage E review.
Every box below was read off a gridded crop of the delivered painting at that orientation, and then drawn over both
paintings with the measured live UI zones (at 390 x 844: Back x 18 to 191, y 16 to 52; name y 64 to 94 from x 16 to
between 159 and 322; story button x 16 to 119, y 110 to 143) to check it against faces, jambs and the heading.

| Item | Room | What changed |
| --- | --- | --- |
| 32, 33 | `it_pescaria` | The haze band ([.12, .25, .62, .34] wide, [.10, .22, .60, .29] portrait) lay across the fishmonger's head, the man behind him and the fishmonger's cap. Re-boxed to the water and the far quay only: wide [.525, .14, .585, .34], the gap between the old man's cap and the girl's headscarf; portrait [.48, .19, .655, .285], above the heads. Alpha stays .42 (at .55 the narrow wide box read as a pale column). The canopy light's drift went from .095 / .085 to .14 / .16 and the birds to scale 1.6 every 6 s to hold the floor; the portrait flock now starts at x .35, clear of the story button |
| 34 | `it_trattoria` | The portrait salumi, which hung across the oste's face, is gone. The hook at (.424, .078) is the only fitting on that wall, so there is nowhere clear to move it. The portrait runs on pour, steam and firebox |
| 35 | `it_friggitoria` | The awning scrap is gone in both compositions. The wide canvas beam could carry a valance, but the sprite swings as one rigid board about its centre, and the portrait beam is inside the heading block |
| 36 | `it_ballaro` | The wide awning on its chain in the sky is gone; the wide takes the palm's leaves instead, boxed to the crown [.70, .03, .80, .19] |
| 37 | `it_ballaro` | Portrait leaves re-boxed from [.60, .06, .82, .26], over the dome, to the palm's crown [.76, .04, .90, .19]. The portrait flock, which crossed behind the room's name, now flies above the dome at [.52, .005, .76, .07] |
| 38 | `it_casale` | Leaves re-boxed to the olive inside the door opening: portrait [.70, .085, .795, .20] (they had sat on the wooden door), wide [.70, .065, .805, .235] (they had crossed the right jamb at .81). The portrait birds keep to the sky inside the opening, [.60, .065, .795, .115], not the plaster beside it |
| 39 | `it_market` | The portrait awning is gone. The portrait leaves were cut to the canopy under the story button, [.10, .17, .30, .235] (they had also run over the woman's headscarf); the wide leaves stop at x .605, short of the plinth; the portrait sun's drift went from .08 to .12 |
| 40 | `it_bacaro`, `it_pasticceria` | Both portrait lamps are gone: their rings at y .086 are inside the heading block, so no lamp can hang from them clear of it. The pasticceria's doorway drift went from .11 to .15 in both compositions |
| 41 | eight rooms | The empty painted iron hooks at the top of the frame are part of the paintings, which were generated with them for the sprites. Accepted, no action. Six more hooks are now empty (trattoria portrait, market portrait, friggitoria both, Ballarò wide, and the two portrait rings), by the same reasoning |
| 42, R3 | `it_laguna` | The front bowl of rice and peas steams: wide (.89, .87) width 170, portrait (.87, .69) width 110. Its plume lights 80,054 canvas pixels wide and 24,037 at 390 wide. The canal haze was also trimmed to [.03, .30, .185, .46], clear of the boy's cap |
| 43, 44 | `it_market`, `it_veneto` | Summer squash beside winter artichokes, and children at glasses of wine: the paintings' content. Accepted, no action |
| 45 | `it_pasta` | The wide cane's nests now hang on the left half of the painted cane only (fx .50, fw .11, ending at x .61, y .117), well above and left of the ribbons the woman lifts (x .60 to .70, from y .24). They read as two things |
| 46, R11 | `it_casale` | Wide re-measured at 3.80 percent (median of six pairs across the cycle) against the 3 percent floor. The only change is the door light's drift, .11 to .15: the whey drip and the olive leaves are small by nature and stay so, and nothing in the room steams |
| R13 | all thirteen | Every patch, glint, steam point and sprite drawn over both paintings. Besides the items above, two boxes crossed an edge and were trimmed (the market's wide leaves, the lagoon kitchen's haze). The sunrays are broad beams that follow each painting's light and pass over figures by nature, as the walkthrough accepted; they were not moved |

**How it was measured.** The rooms were opened with `openLivingScene` straight from `ITALY_SCENES` in a tab loaded
on a plain image URL with `WebSocket` stubbed, so no reload could touch it, at 1280 x 720 and 390 x 844, and ticked
by hand at 1/60 s. The composite sets `width` and `height` on each SVG clone. Six pairs per cell start at frames 60,
284, 508, 732, 956 and 1180, two seconds apart within each pair: that spreads them across the 22.4 s cycle of a beam's
drift, so two of the six land near a turning point (the low figures in each range) and the median reads the room as
a visitor sees it. Pairs are in `.data/it-fix-motion/rm-ITF<w|p>-<room>-<offset>-<a|b>.jpg`;
`uv run --with pillow --with numpy scripts/audit/room-motion.py .data/it-fix-motion 2.5` reproduces them. Lit
pixels are the maximum over 600 stepped frames (10 s) on the room's own effect canvas. The ten fixed regions were
also read as ten-second filmstrips (a composite every second), in both orientations.

**Not verified in this pass.** Real-time watching in a displayed pane: the pane was hidden throughout, so every
room was stepped and read from composites and filmstrips, not watched live. The three rooms not touched here
(`it_forno`, `it_veneto`, `it_tonnara`) keep their Stage C four-pair figures; in the ten touched rooms both
orientations were re-measured. Reduced motion, the world route (`__fw.open`), the touch reactions and `npm run build:pages` were
not run.

### Overlay sheet

Every path, box and anchor this file and the walkthrough-fixes table above describe was checked against the
delivered paintings on one overlay contact sheet, `.data/shots/italy-rooms-overlay.png` (the fix agent's
`italy-fix-rooms.png`, copied over from its scratchpad): both orientations of all thirteen rooms, with the measured
phone-width UI zones (Back button, room name, story button) and every configured signature box, patch box, anchor
and hook drawn over the painting's own pixels. This is the crop-and-overlay step "How it was measured" above
describes, and the sheet is what the boxes in "Fixes from the walkthrough, 2026-09-23" were checked against for
faces, jambs and the heading.

## Status

Built: thirteen rooms in `src/fw/scenes-italy.ts` with three touches each, thirty-nine in total, carrying the
`ITALY_DISCOVERIES` texts word for word; the ambience and hung sprites in `src/fw/italy-ambience.ts`; the thirteen
`it_` signatures in `PAINTED_SIGNATURES`. Registered in `scripts/tests/room-loops.mjs`, `scripts/tests/rooms.html`
and `scripts/tests/room-audit.html` beside Britain's lines, and the signature count in `scene-ambience.mjs` raised
from 102 to 115. `npm run typecheck` passes and `npm test` passes all 25 harnesses.

The shared files — the `it_` signatures in `src/fw/scene-ambience.ts`, the count in `scripts/tests/scene-ambience.mjs`
and the three registrations — are in the working tree and not in this commit. They sit in the same hunks as Britain's
uncommitted registrations, which import `src/fw/scenes-london.ts` while that file is still untracked, and the count of
115 needs both sets; committing them alone would have put a HEAD that fails its own tests into history. They go in
with Britain's room commit, or with the lead's Stage D.
