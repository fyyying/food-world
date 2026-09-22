# Vietnam rooms: the wide and portrait motion matrix

This is the Room maker's Stage C record for the twelve Vietnam rooms of the Southeast Asia world. It covers
`src/fw/scenes-vietnam.ts` (`VIETNAM_SCENES`), `src/fw/vietnam-ambience.ts` (`VIETNAM_AMBIENCE`) and the twelve
`vn_` entries in `PAINTED_SIGNATURES` inside `src/fw/scene-ambience.ts`. The room list, the three discovery
subjects and the signature action come from the Stage B acceptance table and the blueprint in
[vietnam-world.md](vietnam-world.md) and from the delivery inventory
(`~/Downloads/additional game asset/vietnam/vietnam_asset_inventory.md`). The discovery labels and texts are
`VIETNAM_DISCOVERIES` in `src/fw/vietnam-stories.ts` word for word; this file adds no prose of its own to a card.

Every coordinate in both files was read off the delivered file at that orientation. Wide fractions were never
copied into portrait. The wide painting is 1672 x 941 and maps to stage units as `x = fx * 1600`, `y = fy * 900`.
The portrait painting is 941 x 1672 and goes through `pAt(folder, fx, fy)`. The inventory's pixel boxes were the
starting point and every one of them was confirmed on the file at 100 per cent before it was used; where the
measurement and the inventory disagree, the measurement is what the config carries and the difference is noted in
the room's row.

## How to read the matrix

One row per room and orientation. Dominant cue names the room's `PAINTED_SIGNATURES` entry. Supporting cues are the
`VIETNAM_AMBIENCE` patches plus steam, fire, the boiling-pot ellipse and the hung sprite. Visibility is the share of
the frame that visibly changes in two seconds, measured with `scripts/audit/room-motion.py` over composite pairs, at
1280 x 720 for wide and 390 x 844 for portrait; four pairs per cell at step offsets 60, 130, 200 and 270, and the
median is the number recorded. The full method, and why it is not the world route, is in the measurement section at
the end.

### The gánh phở, `vn_pho`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The open stock pot over its charcoal, the small pan pouring broth into the resting bowl, the wire strainer draining noodles, the empty iron peg on the plaster at the upper left, open sky over Hoàn Kiếm | The same pot, pour and bowl, the same strainer, the iron peg on the plaster at fx .167 to .232 |
| Boundary | Steam at the pot mouth (.275, .515) at 300 and at the bowl (.505, .645) at 130; fire ellipse centred (.272, .762), rx 78 ry 24; signature glint [.483, .525, .512, .628]; birds inside [.60, .015, .80, .105] | Steam at the pot mouth (.29, .578) at 190 and at the bowl (.515, .638) at 110; fire centred (.26, .722); pot ellipse (.29, .585) rx 170 ry 20; signature glint [.468, .553, .508, .642]; sprite at fx .1475, fy .172, fw .105 |
| Anchor | The glint starts at the lip of the pan at (.494, .527) and ends on the broth in the bowl at (.504, .625); the steam leaves the pot's mouth and the bowl's own surface, not the ladle and not the bowls the two diners are holding | The same two endpoints on the portrait's own pixels: lip (.534, .506), surface (.573, .622). The sprite's cord sits on the peg bar at fy .147 to .178 |
| Forbidden overlap | The cook's arm and the hanging strainer above the pot, the shoulder pole at y .33 to .40, the flag pole in the lake sky at x .656, the far shore at y .12 | The cook's head and arms, the pole across the frame at y .30, the diners left and right |
| Dominant cue | The ladle of stock going into the waiting bowl, traced lip to surface | The same pour on the portrait's own trace |
| Supporting cues | Steam from the pot and the bowl, the charcoal fire, two gulls over the lake at scale 1.5 every 6 s | Steam from the pot and the bowl, the fire, the stock on the boil inside the pot mouth, the herb bundle swinging on the peg |
| Visibility | 4.05 per cent (4 pairs, 3.5 to 4.6) | 9.50 per cent (9.0 to 10.5) |
| Browser status | Composites read at 1280 x 720. The glint lights 11,226 canvas pixels, the birds 503; the wide peg is deliberately empty, see below | Composites read at 390 x 844. The glint lights 5,840 pixels and the sprite draws at screen x 23 to 76, inside the frame |

**The wide peg is left empty and the loop goes to the lake sky.** The painting's peg is at fx .037 to .099,
fy .088 to .135. A `vn-herb-bundle` was hung on it, and on the live page it is **completely behind the room
heading**: `#scene.has-room-touches .scene-title` sits at `top: 68px` with a 400px max width, which at 1280 x 720
covers painting x .027 to .336 and y .099 to .250. The sprite's own screen box was 41 to 122 x and 67 to 150 y —
inside the heading on both axes. The portrait heading is a single line at `top: 62px` and the portrait peg is below
it, so that orientation keeps the sprite. Two other rooms hit the same corner and are handled the same way:
`vn_bun_bo_hue` (wide rail fx .023 to .220) and `vn_com_vong` (wide peg fx .050 to .098).

**The strainer was traced and is not configured.** The blanching water running off the noodles is painted in both
orientations: wide, the thread leaves the noodle tips at (.411, .497) and stops on the steel rim of the stock pot at
(.415, .535); portrait, it leaves at (.428, .548) and stops at (.432, .586). The wide one was configured as a `drip`
on `[.398, .495, .424, .538]` and taken out again after it was read on the room's own effect canvas: a `drip` sizes
its drop by `min(w * .22, h * .027, 3.6)` and that fall is .043 of the painting high, so the drops cap at a
two-pixel radius and the whole cue lit **120 canvas pixels**, thirty on the screen. That is not a loop. The portrait
is at four loops with its sprite and had no slot for it either.

### The charcoal grill, `vn_bun_cha`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The flare under the pork held in the tongs, the charcoal bed under the grate, the dish of grilled pork, the empty iron rail at fx .766 to .947 | The same flare and bed, the dish of pork at the right, the iron rail at fx .665 to .910 |
| Boundary | Signature embers [.255, .600, .315, .700]; steam (.27, .695) at 270 and (.435, .625) at 110; fire ellipse centred (.245, .815), rx 230 ry 26; sprite at fx .811, fy .186, fw .058 | Signature embers [.525, .605, .615, .700]; steam (.56, .60) at 200 and (.83, .615) at 110; fire centred (.56, .725); sprite at fx .715, fy .172, fw .105 |
| Anchor | The sparks rise out of the one pictured flame between the tongs and the grate; the smoke leaves the grate the pork is on; the fire ellipse sits on the glowing bed, not on the grate bars | Same, with the flare higher in the frame and the bed below it |
| Forbidden overlap | The cook's hands and tongs, the vermicelli bowl and the lettuce basket (both cold), the diners at the right | The cook's arm, the cool vermicelli at (.59, .81), the herb basket at the left |
| Dominant cue | Sparks off the flare under the pork | The same sparks |
| Supporting cues | The grate's smoke, the plate of pork, the charcoal fire, the herb bundle on the rail | The same four |
| Visibility | 4.20 per cent (3.7 to 4.7) | 9.75 per cent (8.3 to 10.4) |
| Browser status | The embers light 20,868 pixels; the bundle hangs on the rail with its cord under the bar | The embers light 1,288 pixels at phone width; the bundle draws at screen x 298 to 349 |

The dipping bowl of fish sauce, water, vinegar and green papaya is the dish's own sauce and is served at room
temperature; it stays dry in both orientations, and so does the plate of cool vermicelli beside it.

### The cloth steamer, `vn_banh_cuon`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The cloth over the boiling drum, the charcoal under it, the tray of finished rolls, the courtyard the room is lit from, the empty peg at fx .855 to .931 | The same drum, fire and rolls, the same courtyard, the peg at fx .855 to .935 |
| Boundary | Signature sunray [.44, 0, .80, .70], angles -.34, drift .095; steam (.27, .592) at 300 and (.535, .818) at 110; fire centred (.245, .872); sprite at fx .867, fy .132, fw .050 | Signature sunray [.18, 0, .77, .55], angle .30, drift .085; steam (.35, .607) at 200 and (.85, .735) at 90; fire centred (.395, .772); sprite at fx .8075, fy .170, fw .095 |
| Anchor | The beam follows the light the courtyard throws across the bench; the big plume leaves the cloth itself, the small one the rolls on their tray | Same, in the taller courtyard the portrait opens |
| Forbidden overlap | The cook's wand and the lifted sheet, the bowl of raw batter at the left, the cooked filling on the boy's board, the dry fried shallot | The sheet, the batter bowl at the lower left, the filling bowl at the right |
| Dominant cue | The courtyard daylight across the steamer | The same daylight |
| Supporting cues | Steam from the cloth and the rolls, the charcoal fire, the sieve on its peg | The same four |
| Visibility | 5.85 per cent (3.6 to 6.8) | 13.40 per cent (10.4 to 14.0) |
| Browser status | The ray lights 247,014 pixels; the sieve's cord sits on the peg bar since it was raised from fy .158 to .132 | The ray lights 217,688 pixels; the sieve was raised from fy .198 to .170 for the same reason, and draws at screen x 343 to 389, inside the frame |

The portrait peg runs to fx .935, which is outside the x .094 to .906 slice a 390-wide viewport shows of this
painting. The sieve hangs from the inner end of the same peg, at fx .8075 to .9025, so the whole sprite is on
screen; its cord is under the bracket's wall plate rather than its tip.

### The green-rice courtyard, `vn_com_vong`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The fire under the roasting pan, the courtyard's own hard daylight, the open pond at fx .625 to .855, the empty wall peg at fx .050 to .098 | The same fire and daylight, the pond band at fy .245 to .295, the wall peg at fx .880 to .974 |
| Boundary | Signature sunray [.28, 0, .78, .66], angle .34, drift .095; fire centred (.15, .835), rx 90 ry 24; embers [.09, .775, .215, .875]; lotus sprite at fx .677, fy .412, fw .046 | Signature sunray [.28, 0, .86, .52], angle .30, drift .085; fire centred (.185, .572); sieve at fx .8075, fy .094, fw .095; lotus at fx .345, fy .238, fw .088 |
| Anchor | The beam keeps the direction of the painted shadows: the door frame and the mortar throw theirs down and to the left across the paving. The sparks stay inside the pictured flame under the roasting pan. The lotus blade floats on the clear water and its stem runs down into it | Same, and the lotus sits on the one stretch of open water between the plants at x .33 and x .47 |
| Forbidden overlap | The pounder at x .38 to .48, the roaster's hands, the winnowing trays of cốm, the lotus packets, the boy at x .59 to .72 | The pounder in the middle of the frame, the man at the left, the trays of cốm below |
| Dominant cue | The sun through the courtyard tree | The same sun |
| Supporting cues | The roasting fire, sparks off it, the lotus leaf on the pond | The roasting fire, the sieve on its peg, the lotus leaf |
| Visibility | 3.85 per cent (3.4 to 4.7) | 5.70 per cent (3.6 to 6.6) |
| Browser status | The ray lights 200,871 pixels and the sparks 296 | The ray lights 105,178 pixels; both sprites draw inside the frame, the sieve at screen x 343 to 389 and the lotus at 121 to 165 |

**This is the one room in the set with no steam anywhere**, in either orientation, and that is the point of it: the
young grain is roasted dry, pounded, winnowed and wrapped, all of it cold, and the only heat pictured is the fire
under the roasting pan. That makes its signature the whole of its motion budget, and the first one chosen was not
enough. Gulls over the paddy sky at scale 1.6 gave **0.1 to 0.2 per cent** of the frame changing in two seconds
across eight capture pairs, against a 2.5 per cent floor, because two bird strokes and five sparks are a rounding
error in a changed-pixel count. The courtyard's own daylight replaced them and took both orientations over floor at
the first attempt. The wide peg is under the room heading, as `vn_pho`'s is, so the sieve hangs in the portrait
alone and the wide loop goes to the sparks.

### The Huế broth bench, `vn_bun_bo_hue`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The open pot with the lemongrass in it, the fire under it, the ladle pouring through a strainer into the bowl, the haze on the Perfume River, the empty rail at fx .023 to .220 | The same pot, fire, pour and bowl, the rail at fx .810 to 1.0 |
| Boundary | Signature glint [.378, .412, .412, .632]; steam (.16, .555) at 300 and (.405, .618) at 120; fire centred (.255, .875); pot ellipse (.16, .570) rx 250 ry 28; mist [.60, .27, .92, .38] at alpha .42 | Signature glint [.522, .504, .592, .626]; steam (.17, .605) at 200 and (.55, .612) at 110; fire centred (.13, .745); pot (.17, .625) rx 170 ry 24; sprite at fx .805, fy .190, fw .100 |
| Anchor | The glint starts at the ladle's lip at (.3865, .414), passes through the strainer the other hand holds at (.402, .520) and ends on the broth in the bowl at (.398, .628); the boil is on the pot's own surface among the painted lemongrass | The same three points on the portrait: lip (.534, .506), strainer (.553, .550), surface (.573, .622) |
| Forbidden overlap | The cook's hands and the strainer's rim, the herb plate at (.72, .78), the raw beef, the shrimp-paste jar, the diners at the right | The cook's arm, the lemongrass basket, the herb plate, the jar in the foreground |
| Dominant cue | The strained broth from the ladle lip to the bowl | The same pour |
| Supporting cues | Steam from the pot and the bowl, the fire, the boil, the river haze | Steam from the pot and the bowl, the fire, the boil, the herb bundle on the rail |
| Visibility | 4.15 per cent (3.8 to 4.3) | 10.15 per cent (9.2 to 10.6) |
| Browser status | The glint lights 25,592 pixels and the mist 58,117 | The glint lights 12,445 pixels; the bundle draws at screen x 339 to 390 |

The strainer's own drips, at x .41 to .45 between y .54 and .60 in the wide painting, were measured and left
unconfigured: the signature already traces the same liquid through the same strainer, and a second cue on it would
double the one action the room is of.

### The little cakes of Huế, `vn_hue_cakes`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The tray of bánh bèo lifted clear of the steamer, the open steamer under it, the fire below, the side window the bench is lit from, the empty beam at fx .505 to .745 | The same tray, steamer, fire and window, the beam at fx .05 to .40 |
| Boundary | Signature sunray [.62, 0, 1, .72], angle .42, drift .090; steam (.175, .315) at 260 and (.175, .485) at 190; fire centred (.115, .90); sprite at fx .4825, fy .128, fw .075 | Signature sunray [.52, 0, .90, .52], angle .38, drift .080; steam (.57, .365) at 220 and (.54, .455) at 170; fire centred (.51, .645); sprite at fx .245, fy .100, fw .130 |
| Anchor | The beam comes in from the side window on the right, which is where the painting's own light and its cast shadows come from; the plumes leave the lifted tray and the open steamer, not the folded leaf cakes waiting on the bench | Same, with the window in the upper right and the steamer central |
| Forbidden overlap | The worker's hands and the tray's rim, the bánh bèo dishes, the scallion oil and the dipping sauce, the woman's head from x .565, the man at the right | The worker's arms, the cake trays in the foreground, the man's head at the lower left |
| Dominant cue | The side window's light across the cake bench | The same light |
| Supporting cues | Steam from the tray and the steamer, the fire, the banana leaf on the beam | The same four |
| Visibility | 7.55 per cent (6.0 to 8.1) | 10.80 per cent (10.0 to 12.0) |
| Browser status | The ray lights 232,286 pixels; the leaf hangs from the beam clear of the worker's head, which starts at x .565 | The ray lights 164,075 pixels; the leaf draws at screen x 73 to 136 |

The banana leaf shipped at `fw` .050 and read as a plain green cone at that size; it was taken to .075 wide and
.130 phone so the leaf's fold and veining read, and moved left from fx .575 to .4825 so its tip clears the
worker's head.

### The Hội An shophouse, `vn_cao_lau`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The open stove mouth at the left edge, the pot on it, the bowl of noodles being turned, the river door at the back, the empty nail at fx .445 to .468 | The bowl and the lifted noodles, the pot on the left counter, the river door, the sky over the far bank, the haze on the water |
| Boundary | Signature sunray [.56, 0, .88, .66], angle .38, drift .095; steam (.075, .385) at 95 and (.34, .585) at 120; fire centred (.028, .515), rx 34 ry 26; sprite at fx .4185, fy .120, fw .075 | Signature sunray [.42, 0, .80, .50], angle .32, drift .085; steam (.16, .33) at 90 and (.47, .605) at 150; `fire: []`; birds [.47, .115, .70, .185]; mist [.46, .255, .74, .40] at alpha .45 |
| Anchor | The beam is the river door's daylight coming up the shop; the flame is in the pictured stove mouth and nowhere else | The portrait screens the stove behind the left counter, so it declares an empty fire list rather than glowing where no flame is drawn. The birds stay between the door head and the roofs on the far bank; the mist sits on the water the painting already paints hazy |
| Forbidden overlap | The cook's chopsticks and the lifted noodles, the cracklings at (.115, .90), the sliced pork and herbs, the diners at the right | The cook's arms, the noodle bowl, the cracklings basket, the tied boat at the quay |
| Dominant cue | The river door at the back of the shophouse | The same door |
| Supporting cues | Steam from the stove pot and the bowl, the stove flame, the bamboo fan on its nail | Steam from the counter pot and the bowl, two birds over the far bank, the river haze |
| Visibility | 4.55 per cent (3.7 to 5.3) | 10.50 per cent (9.3 to 12.2) |
| Browser status | The ray lights 173,701 pixels; the fan hangs on the post nail | The ray lights 119,542 pixels, the birds 5,729 and the mist 44,109. No sprite: see below |

**The portrait carries no sprite.** Its fan nail is at fx .919 to .962, outside the x .094 to .906 slice a 390-wide
viewport shows of this painting, so anything hung on it would draw nothing at all; hanging the fan a few per cent
to its left instead would put an object in mid-air beside a visible empty nail, which is the defect the Spain
sprite pass was written to avoid. The two loops the portrait frees — no flame and no sprite — go to the river the
shophouse is built around.

### The Quảng Nam counter, `vn_mi_quang`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The copper broth pot, the embers under it, the measured ladle of turmeric broth going into the shallow bowl, the airwell over the canal front, the empty nail at fx .901 to .923 | The same pot, ladle and bowl, the airwell, the nail at fx .880 to .924 |
| Boundary | Signature glint [.374, .545, .404, .666]; steam (.13, .49) at 260 and (.405, .655) at 180; fire centred (.145, .688); sprite at fx .877, fy .112, fw .070 | Signature glint [.456, .543, .506, .642]; steam (.12, .555) at 200 and (.51, .645) at 150; `fire: []`; sunray [.30, 0, .78, .50]; sprite at fx .813, fy .165, fw .090 |
| Anchor | The glint starts at the ladle's lip at (.384, .547) and ends on the noodles at (.393, .663), which is where the shallow bowl's liquid stops — the toppings stay above it and nothing glints over them | The same two points on the portrait: lip (.468, .545), surface (.494, .640) |
| Forbidden overlap | The cook's hands, the broad noodles at (.135, .845), the sesame cracker, the shredded banana flower, the diners at the right | The cook's arm, the noodle basket, the cracker at (.88, .645), the banana flower at (.60, .885) |
| Dominant cue | One measured ladle of broth into the shallow bowl | The same pour |
| Supporting cues | Steam from the pot and the bowl, the embers, the fan on its nail | Steam from the pot and the bowl, the airwell daylight, the fan |
| Visibility | 4.45 per cent (4.1 to 5.3) | 12.20 per cent (10.3 to 13.8) |
| Browser status | The glint lights 12,880 pixels; the fan hangs on the wall nail | The glint lights 7,988 pixels and the ray 156,553; the fan draws at screen x 345 to 388 |

The embers under the copper pot are pictured in the wide painting and not in the portrait, so the portrait declares
an empty fire list and the airwell's daylight takes the freed loop. That patch is phone-only: the wide painting is
already at four.

### The bread and pâté counter, `vn_bread_pate`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The charcoal oven mouth with the loaves in it, the colonnade light off the street, the empty nail at fx .925 to .954 | The same oven mouth and street, the nail at fx .909 to .961 |
| Boundary | Signature sunray [.50, 0, .88, .70], angles -.32, drift .095; steam (.10, .40) at 160; fire centred (.10, .495), rx 88 ry 22; sprite at fx .907, fy .120, fw .062 | Signature sunray [.40, 0, .86, .55], angle .34, drift .085; steam (.12, .415) at 140; fire centred (.115, .505); embers [.096, .445, .205, .545] |
| Anchor | The heat leaves the oven mouth, where the loaves are still baking, and nothing else on this counter steams; the beam keeps the street's own direction | Same, and the sparks stay inside the charcoal bed the painting draws under the loaves |
| Forbidden overlap | The vendor's knife and hands, the split loaf on the board, the pâté in its crock, the basket of cooled bread, the eggs and the herbs | The vendor's arms, the loaf on the board, the crock at (.85, .625), the basket at (.17, .69) |
| Dominant cue | The colonnade light off the street the counter faces | The same light |
| Supporting cues | The oven's heat, the oven fire, the fan on its nail | The oven's heat, the oven fire, sparks off the charcoal bed |
| Visibility | 3.80 per cent (1.4, 2.6, 5.0, 5.1) | 6.55 per cent (4.0 to 7.4) |
| Browser status | The ray lights 220,684 pixels; the fan hangs from its hook | The ray lights 88,608 pixels and the sparks 394 |

**The one counter in the set that sells nothing hot.** The loaf on the board, the pâté under its fat, the basket of
cooled bread, the eggs and the loose herbs are all cold and all stay dry; the only heat is the oven mouth, and the
period decision means there is no assembled sandwich here to steam. The wide window spread (1.4 to 5.1) is the
`sunray` stall the Spain record describes: `drawAmbience` moves a beam by `sin(t * .28)`, whose travel passes
through zero twice in every 22.4-second cycle, and a two-second window can land on that. The median clears the
floor and the oven's heat and fire never stall.

The portrait's nail is outside the phone slice, as `vn_cao_lau`'s is, so this room hangs nothing on a phone and the
freed loop goes back to the oven as sparks. The embers box was cut in from fx .04 to .096 after it was checked
live: the part left of .094 would have drawn off the screen.

### The Chợ Lớn noodle shop, `vn_hu_tieu`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The open stock pot with the bones in it, the wire basket draining noodles in its own painted column of drops, the bowl being filled, the street doorway, the empty nail at fx .943 to .965 | The same pot, basket and bowl, the same doorway, the nail at fx .195 to .234 |
| Boundary | Signature drip [.288, .562, .316, .760] at period 1.5 with its ring; steam (.24, .70) at 300 and (.37, .625) at 120; `fire: []`; pot ellipse (.24, .755) rx 270 ry 40; sunray [.52, 0, .86, .68]; sprite at fx .923, fy .105, fw .062 | Signature drip [.283, .525, .313, .600], no ring; steam (.15, .585) at 190 and (.46, .585) at 110; `fire: []`; pot (.15, .60) rx 150 ry 26; sunray [.55, 0, .90, .50]; sprite at fx .154, fy .152, fw .120 |
| Anchor | The drops leave the wire basket at (.302, .565) and land on the stock at (.303, .755), where the painting draws its own ring, so the splash is on. Nothing is drawn on the noodle rope beside it: that is not a liquid | The drops leave at (.297, .527) and fade out at the pot's near rim at (.295, .598). That end shows steel, not liquid, so the portrait takes **no** splash |
| Forbidden overlap | The cook's arm and the basket's handle, the stack of wire baskets at (.055, .555), the finished bowls at (.61, .81), the diners in the street | The cook's arm, the baskets at the left, the bowls in the foreground |
| Dominant cue | The wire basket's one shake, off the noodles and back into the stock | The same drain |
| Supporting cues | Steam from the pot and the bowl, the stock on the boil, the street daylight, the fan on its nail | The same four |
| Visibility | 4.70 per cent (3.6 to 7.2) | 9.45 per cent (7.4 to 13.2) |
| Browser status | The drip lights 20,086 pixels and the ray 196,044; there is no fire ellipse in either orientation | The drip lights 3,584 pixels and the ray 65,892; the fan draws at screen x 29 to 87 |

This is the one kitchen in the set whose pot stands on a closed stove: no flame is pictured in either orientation,
so neither carries a fire ellipse, and the street's daylight takes that loop in both. It is also the only room
where the same ambience patch is given both rectangles, because the loop it replaces is missing from both.

### The sizzling pan, `vn_banh_xeo`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The tilted pan of batter, the hearth under it, the platter of finished crêpes, the bánh khọt mould over its own second hearth, the clean sky between the palms, the empty roof beam at fx .653 to .975 | The same pan, hearth, platter and mould, the sky over the canal, the roof beam at fx .314 to .987 |
| Boundary | Signature birds [.50, .025, .63, .125] at scale 1.5 every 6 s; steam (.32, .485) at 210, (.66, .715) at 140 and (.90, .730) at 120; fire centred (.31, .665), rx 130 ry 32; sprite at fx .684, fy .118, fw .072 | Signature birds [.47, .105, .72, .175]; steam (.47, .545) at 200, (.22, .825) at 140 and (.79, .755) at 110; fire centred (.51, .685); sprite at fx .235, fy .112, fw .130 |
| Anchor | The birds cross the one clean band of sky between the palms; the three plumes leave the pan, the platter and the dimpled mould, each of which has a fire under it or has just come off one | Same, in the sky band the portrait opens between the roof and the palms |
| Forbidden overlap | The cook's hands and the pan's rim, the batter bowl at (.09, .695), the herbs and bean sprouts, the dipping bowl | The cook's head from x .38, the herb basket, the batter bowl at (.86, .69) |
| Dominant cue | Two birds over the canal | The same birds |
| Supporting cues | Steam from the pan, the platter and the mould, the hearth fire, the banana leaf on the beam | The same four |
| Visibility | 4.75 per cent (4.3 to 5.1) | 14.60 per cent (13.5 to 16.6) |
| Browser status | The birds light 195 pixels at their crossing; the leaf hangs from the beam over the palms | The birds light 166 pixels; the leaf draws at screen x 68 to 131, clear of the cook |

The round woven trays the portrait already paints hanging at its upper left are left alone: the `vn-rice-sieve`
sprite belongs to `vn_banh_cuon` and `vn_com_vong` and is not added here, as the Stage B note asks.
The wide painting measured 2.35 per cent before the mould's own plume was added and the pan's was widened from 150
to 210; those are two vessels the painting really does show on a fire, and the room now sits at 4.75.

### The delta family table, `vn_mekong_home`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The open clay pot with the glaze reducing in it, the hearth under it, the bowl of sour canh chua, the small braised pot, the shared rice, the clean sky path over the water, the empty roof beam at fx .650 to .998 | The same pot, hearth, soup, braised pot and rice, the glaze thread from the tilted bowl, the roof beam at fx .304 to .981 |
| Boundary | Signature drip [.596, .655, .624, .686] at period 2.1 with its ring; steam (.655, .605) at 240, (.145, .730) at 130, (.320, .825) at 100 and (.120, .605) at 80; fire centred (.635, .885); pot ellipse (.625, .685) rx 180 ry 42; kingfisher at fx .494, fy .060, fw .058 | Signature drip [.730, .503, .754, .538] with its ring; steam (.64, .555) at 200, (.190, .715) at 130, (.440, .855) at 100 and (.140, .900) at 80; fire centred (.585, .735); pot (.645, .60) rx 150 ry 30; banana leaf at fx .285, fy .112, fw .130 |
| Anchor | The glaze runs off the brush tip at (.608, .657) and reaches the glaze pooled round the fish at (.612, .682), which is a liquid surface, so the ring is on. The bird flies in clean sky left of the cook's turban, which starts at x .555 | The portrait draws the same glaze as a thread off the lip of the tilted bowl: it leaves at (.740, .505) and lands in the pot at (.742, .535) |
| Forbidden overlap | The cook's brush hand and the bowl she holds, the turban from x .555, the herbs and star fruit beside the soup, the bowls the man and the boy are holding | The cook's arm, the boy at the left, the rice bowl he holds |
| Dominant cue | The glaze going back over the fish | The same glaze, on the portrait's own fall |
| Supporting cues | Steam from the clay pot, the sour soup, the braised pot and the rice; the hearth; the glaze on the boil at the pot's rim; the kingfisher over the water | The same four, with the banana leaf on the beam in place of the bird |
| Visibility | 5.30 per cent (4.9 to 5.9) | 15.20 per cent (13.6 to 16.6) |
| Browser status | The drip lights 3,285 pixels; the kingfisher flies clear of the cook since it moved from fx .536 to .494 and fy .105 to .060 | The drip lights 1,380 pixels; the leaf draws at screen x 92 to 155 |

**One sprite per orientation, and a different one in each.** Two would put this room at five always-on loops beside
its signature, its steam and its fire. The wide painting keeps a clear sky path over the water and takes the
`vn-kingfisher`, which hangs nowhere else in the set; the portrait's own sky path runs from fx .675 to 1.0, most of
it outside the slice a phone shows, so the portrait takes the `vn-banana-leaf` on its roof beam instead. Both
sprites are therefore used in the room the inventory places them in, and each orientation stays at four.

The wide painting measured 1.95 per cent with the clay pot as its only plume. The painting draws four hot things on
that table — the pot, the sour soup, the braised pot and the shared rice — and giving each its own source took the
room to 5.30. The herbs, the limes, the star fruit and the two bowls held in hands stay dry.

## Loop counts

Every Vietnam room sits at exactly **four** always-on loops in both orientations, counted the way
`room-loops.mjs` counts them: signature + steam + fire + ambience patches + hung sprites, with the engine's
`choose` in `scene-painted.ts` slicing the ambience list to `3 - heat`. The harness itself does not cover this
area — its rolldown build takes `scenes-china.ts`, `scenes-turkey.ts` and `scenes-spain.ts` only, and no `.mjs`
test is mine to edit — so the same count was run over `VIETNAM_SCENES` from a copy of that code and is reproduced
here. The lead should add `scenes-vietnam.ts` (and Thailand's) to `room-loops.mjs` at Stage D.

| Room | Wide | Portrait |
| --- | --- | --- |
| `vn_pho` | glint + steam(2) + fire + birds | glint + steam(2) + fire + sprite |
| `vn_bun_cha` | embers + steam(2) + fire + sprite | embers + steam(2) + fire + sprite |
| `vn_banh_cuon` | sunray + steam(2) + fire + sprite | sunray + steam(2) + fire + sprite |
| `vn_com_vong` | sunray + fire + embers + sprite | sunray + fire + sprite + sprite |
| `vn_bun_bo_hue` | glint + steam(2) + fire + mist | glint + steam(2) + fire + sprite |
| `vn_hue_cakes` | sunray + steam(2) + fire + sprite | sunray + steam(2) + fire + sprite |
| `vn_cao_lau` | sunray + steam(2) + fire + sprite | sunray + steam(2) + birds + mist |
| `vn_mi_quang` | glint + steam(2) + fire + sprite | glint + steam(2) + sunray + sprite |
| `vn_bread_pate` | sunray + steam + fire + sprite | sunray + steam + fire + embers |
| `vn_hu_tieu` | drip + steam(2) + sunray + sprite | drip + steam(2) + sunray + sprite |
| `vn_banh_xeo` | birds + steam(3) + fire + sprite | birds + steam(3) + fire + sprite |
| `vn_mekong_home` | drip + steam(4) + fire + sprite | drip + steam(4) + fire + sprite |

The boiling-pot ellipse is free under that ceiling — `room-loops.mjs` counts it only in a room with no signature —
and four rooms carry one where the painting opens a liquid surface on a rolling boil: `vn_pho` portrait, both
orientations of `vn_bun_bo_hue` and `vn_hu_tieu`, and both of `vn_mekong_home`.

## Every pictured hot vessel steams

Twenty-nine steam sources are configured across eleven rooms: the phở stock pot and its filled bowl; the bún chả
grate and the dish of pork off it; the bánh cuốn cloth and the tray of rolls; the Huế broth pot and its bowl; the
lifted cake tray and the open steamer under it; the cao lầu stove pot and the noodle bowl; the mì Quảng broth pot
and its bowl; the bread oven's mouth; the hủ tiếu stock pot and the bowl being filled; the bánh xèo pan, the
platter of finished crêpes and the bánh khọt mould; and the four hot dishes on the Mekong table — the clay pot, the
sour soup, the braised pot and the shared rice. Fire ellipses sit where a flame is pictured, which is ten rooms;
`vn_hu_tieu` declares an empty list in both orientations because its pot stands on a closed stove, and
`vn_cao_lau` and `vn_mi_quang` declare an empty portrait list because those two compositions screen the fire the
wide painting shows.

Nothing cold steams, and that is a deliberate list: the herb plates at every bench, the cool vermicelli and the
raw rice noodles, the green rice flakes and the lotus wrapping in `vn_com_vong`, the batter bowls in
`vn_banh_cuon` and `vn_banh_xeo`, the pickles and the dipping bowls, the loaf on the board and the pâté in its
crock, the cracklings, the sesame cracker, the shredded banana flower and the limes. Vessels held in a hand are
left dry too, which is the rule Spain's paella room already stated: the bowls the two phở diners hold, the cup in
the cao lầu eater's hand, and the rice bowls the man and the boy hold at the Mekong table.

## Breeze masks

**Vietnam ships no breeze crop, and none was tried.** Every one of the twelve paintings was composed with an empty
peg, rail, nail or beam and its hanging object arrived as a separate keyed sprite, which is the standard the owner
asked for on 2026-09-16 after the Spanish pepper strings were cut out of their pictures and put back. So nothing in
this area isolates a painted subject by colour, `isBreezePixel` is never called for a `vn_` room, and
`scripts/audit/breeze-masks.py` renders the same 30 crops it did before this work — China's, Xinjiang's and
Turkey's — with no Vietnam file among them.

## Sprites

All six delivered sprites ship. Nineteen hangings across the twelve rooms:

| Sprite | Wide | Portrait |
| --- | --- | --- |
| `vn-herb-bundle` | `vn_bun_cha` fx .811 fy .186 fw .058 | `vn_pho` .1475/.172/.105, `vn_bun_cha` .715/.172/.105, `vn_bun_bo_hue` .805/.190/.100 |
| `vn-rice-sieve` | `vn_banh_cuon` .867/.132/.050 | `vn_banh_cuon` .8075/.170/.095, `vn_com_vong` .8075/.094/.095 |
| `vn-lotus-leaf` | `vn_com_vong` .677/.412/.046 | `vn_com_vong` .345/.238/.088 |
| `vn-banana-leaf` | `vn_hue_cakes` .4825/.128/.075, `vn_banh_xeo` .684/.118/.072 | `vn_hue_cakes` .245/.100/.130, `vn_banh_xeo` .235/.112/.130, `vn_mekong_home` .285/.112/.130 |
| `vn-bamboo-fan` | `vn_cao_lau` .4185/.120/.075, `vn_mi_quang` .877/.112/.070, `vn_bread_pate` .907/.120/.062, `vn_hu_tieu` .923/.105/.062 | `vn_mi_quang` .813/.165/.090, `vn_hu_tieu` .154/.152/.120 |
| `vn-kingfisher` | `vn_mekong_home` .494/.060/.058 | — |

Sway runs from 2.0 degrees on the lotus leaf, which stands in water, to 3.4 on the herb bundle in the draught of
the bún chả brazier. `tone` seats each sprite in its room's own light: .84 for the sieve on a sunlit courtyard
wall, .92 for the kingfisher against a sunset sky.

Five orientations hang nothing, each for a reason measured on the live page and recorded in the room's own section
above: `vn_pho` wide, `vn_bun_bo_hue` wide and `vn_com_vong` wide because the painted support is under the room
heading; `vn_cao_lau` portrait and `vn_bread_pate` portrait because the painted nail is outside the slice a
390-wide viewport shows. In all five the freed loop goes to a cue the painting already carries.

Three placements were corrected after the first live look, and the corrections are the reason for a second capture
pass: the rice sieve hung a third of its own diameter below its peg in three orientations and was raised to it; the
banana leaf read as a plain green cone at `fw` .050 and was enlarged and moved off two workers' heads; and the
kingfisher flew directly over the Mekong cook's turban and was moved left and up into clean sky.

## Measured motion

Captured on 2026-09-22. Vietnam is not registered in `graph.ts` until Stage D, so the world route the Spain record
uses (`__fw.enter`, `__fw.open`, `__fw.sceneShot`) cannot reach these rooms yet. The captures were taken instead by
driving the room engine directly on the dev server at `http://localhost:5180`, which is the same code the world
route runs and the same composite:

1. `openLivingScene(VIETNAM_SCENES[id](), …)` into a host element sized 1280 x 720 or 390 x 844, so the engine's
   own `resize()` picks the orientation exactly as a viewport of that size does
2. `tick(t, 1/60)` called by hand, sixty steps to the simulated second, because the Browser pane was hidden for the
   whole run and `requestAnimationFrame` does not fire in a hidden pane — this is the equivalent of `__fw.step(n)`,
   which exists for the same reason
3. per pair: step the offset, composite, step 120 (two simulated seconds), composite again, and POST each one to
   `/api/debug/shot`, which is where `__fw.sceneShot` sends its own
4. four pairs per room per orientation at offsets 60, 130, 200 and 270, so the pairs land at different points of
   the `sunray` and `stream-glint` cycles rather than beating against them
5. `uv run --with pillow --with numpy scripts/audit/room-motion.py .data/shots`

One correction to the composite had to be made for the portrait numbers to mean anything, and it is worth the
lead's attention because it applies to every portrait figure in `docs/spain-rooms.md` as well. `snapshot()` in
`scene.ts` serialises each layer's `<svg>` without width or height attributes, so the browser gives the data URI
the default 300 x 150 intrinsic box and `drawImage(img, 0, 0, W, H)` stretches that; at 390 x 844 the painting ends
up in a narrow central band with dark stage either side. That is exactly the caveat the Spain record describes as
"the portrait composites squash the painting into a central band". The portrait captures here were taken with a
local copy of `snapshot()` that sets `width` and `height` on the clone before serialising, so each portrait
composite is the picture a 390 x 844 phone really shows. The wide composites are unaffected either way. **No engine
file was changed for this**; the correction lives only in the capture script.

| Room | Wide at 1280 x 720, median (four pairs) | Portrait at 390 x 844, median (four pairs) | Floor |
| --- | --- | --- | --- |
| `vn_pho` | 4.05 (3.5, 3.6, 4.5, 4.6) | 9.50 (9.0, 9.1, 9.9, 10.5) | 3.0 |
| `vn_bun_cha` | 4.20 (3.7, 3.7, 4.7, 4.7) | 9.75 (8.3, 9.5, 10.0, 10.4) | 3.0 |
| `vn_banh_cuon` | 5.85 (3.6, 5.4, 6.3, 6.8) | 13.40 (10.4, 13.0, 13.8, 14.0) | 3.0 |
| `vn_com_vong` | 3.85 (3.4, 3.5, 4.2, 4.7) | 5.70 (3.6, 5.0, 6.4, 6.6) | 2.5 |
| `vn_bun_bo_hue` | 4.15 (3.8, 4.1, 4.2, 4.3) | 10.15 (9.2, 10.0, 10.3, 10.6) | 3.0 |
| `vn_hue_cakes` | 7.55 (6.0, 7.2, 7.9, 8.1) | 10.80 (10.0, 10.4, 11.2, 12.0) | 3.0 |
| `vn_cao_lau` | 4.55 (3.7, 4.4, 4.7, 5.3) | 10.50 (9.3, 10.1, 10.9, 12.2) | 3.0 |
| `vn_mi_quang` | 4.45 (4.1, 4.3, 4.6, 5.3) | 12.20 (10.3, 11.2, 13.2, 13.8) | 3.0 |
| `vn_bread_pate` | 3.80 (1.4, 2.6, 5.0, 5.1) | 6.55 (4.0, 5.9, 7.2, 7.4) | 3.0 |
| `vn_hu_tieu` | 4.70 (3.6, 4.1, 5.3, 7.2) | 9.45 (7.4, 9.4, 9.5, 13.2) | 3.0 |
| `vn_banh_xeo` | 4.75 (4.3, 4.7, 4.8, 5.1) | 14.60 (13.5, 14.4, 14.8, 16.6) | 3.0 |
| `vn_mekong_home` | 5.30 (4.9, 5.3, 5.3, 5.9) | 15.20 (13.6, 14.0, 16.4, 16.6) | 3.0 |

Every cell clears its floor on the median: 3 per cent for the eleven rooms with heat, 2.5 for `vn_com_vong`, which
has none. Five cells were strengthened during the pass and are recorded with what changed:

| Room and orientation | Before | Now | What changed |
| --- | --- | --- | --- |
| `vn_com_vong` wide | 0.1 | 3.85 | Signature from `birds` over the paddy sky to `sunray` across the courtyard |
| `vn_com_vong` portrait | 0.2 | 5.70 | The same signature, on the portrait's own box |
| `vn_banh_xeo` wide | 2.35 | 4.75 | The bánh khọt mould's own plume added, the pan's widened from 150 to 210 |
| `vn_mekong_home` wide | 1.95 | 5.30 | The sour soup, the braised pot and the shared rice each given their own plume, the clay pot's widened to 240 |
| `vn_mi_quang` wide | 3.10 | 4.45 | Both plumes widened and taken to rate 10 |

Raw composites are `.data/shots/rm-VNw-<room>-<1..4>-a/b.jpg` (wide) and `rm-VP-<room>-<1..4>-a/b.jpg` (portrait).
The earlier `rm-VNp-*` set is the uncorrected portrait composite and is superseded by `rm-VP-*`.

## Every cue draws, and draws where a phone can see it

Two checks were run over the built configs rather than trusted from the source, and both are reproducible from the
numbers in this file.

**The phone slice.** `paintingFrame` fits the portrait painting at 512.2 stage units and a 390 x 844 viewport shows
415.9 of them, so the visible slice of every portrait painting here is **x .094 to .906**. Every phone patch box,
every phone sprite and every phone hotspot anchor was checked against that slice. Three boxes were cut in after the
check: `vn_hue_cakes`'s signature ray from .95 to .90, `vn_hu_tieu`'s street ray from .95 to .90, and
`vn_bread_pate`'s oven embers from .04 to .096. Two painted supports could not be brought inside it at all and
their rooms hang nothing in portrait, which the sections above record.

**Lit pixels.** Each room was opened at both sizes and its own effect canvas read inside every configured cue box
over 108 stepped frames, taking the maximum. Every signature and every ambience patch lights pixels in every
orientation it declares. The smallest are the bird crossings — `vn_banh_xeo` at 166 pixels on a phone, `vn_pho` at
503 wide — which is the nature of two thin silhouettes and is why neither room leans on them for its floor. The
largest are the rays, at 88,000 to 247,000. Every hung sprite was read from the DOM at both sizes and every one of
the nineteen draws a box with positive width, inside the frame.

## Reduced motion

Not verified in this pass, and it is the one line of the definition of done this record cannot claim. The engine
reads `matchMedia('(prefers-reduced-motion: reduce)')` on every tick in `scene-props.ts`, `scene-painted.ts` and
`scene.ts`, and none of those files is Vietnam's; the Spain verification of 2026-09-16 exercised the same code
paths with the same effect kinds this area uses (`sunray`, `birds`, `leaves`, `light`, `stream-glint`, `drip`,
`mist`, `embers`, steam, fire and a hung sprite), so there is no Vietnam-specific behaviour to test. It should
still be looked at once in the pane before Stage F, together with the portrait look below.

## What is not verified

- **Reduced motion**, as above.
- **A displayed pane.** The Browser pane was hidden for this whole pass — other agents were using it — so every
  figure and every look here comes from the room engine driven by hand and from composites read off disk, not from
  watching the animation run in a visible window. The composites are the engine's own and four of them per cell,
  two simulated seconds apart, are what the motion numbers are measured on, but a continuous twenty-second watch in
  a displayed pane is not something this pass could do.
- **The world route.** Vietnam has no `graph.ts` registration until Stage D, so no room was opened by clicking its
  object, and the 1.6-second approach flight before a room opens was not exercised.
- **The touch reactions.** `prop-reactions.mjs` and `room-controls.mjs` pass, and they cover the effect vocabulary
  these thirty-six hotspots use, but no Vietnam touch was clicked on the live page.
- **`scene-ambience.mjs`'s signature count**, which is verified but not by this role. The harness asserts the exact
  number of entries in `PAINTED_SIGNATURES`; it read 65, and with Thailand's twelve and Vietnam's twelve it is 89.
  That is a `.mjs` test this role may not edit, so the twelve `vn_` entries were checked against every other
  assertion in it by running a copy with the count raised — the paired wide and phone anchors, the traced paths on
  every glint, the bounded drawing budget, the finite coordinates and the change-with-time check all hold — and the
  count itself was left to its owner. It was raised to 89 in the working tree while this pass ran, and
  `npm test` now passes all 21 harnesses with both areas in place.

## Status

Built: all twelve rooms in `src/fw/scenes-vietnam.ts` as `paintedScene` configs with three touches each, thirty-six
in total, each naming a subject visible in both orientations and carrying its `VIETNAM_DISCOVERIES` text word for
word; the per-orientation ambience in `src/fw/vietnam-ambience.ts`; and the twelve `vn_` signature entries in
`PAINTED_SIGNATURES`. Every wide and portrait coordinate was measured on the delivered file at that orientation.
Effects are `detail` on cold subjects, `tea` on the bánh cuốn cloth, the bánh bèo dishes, the hủ tiếu stock and the
Mekong clay pot, and `sizzle` at the bún chả grate, the cốm roasting pan, the bread oven and the bánh khọt mould;
no `light`, `leaves`, `water`, `flour` or `chime` touch was needed.

Files touched: `src/fw/scenes-vietnam.ts`, `src/fw/vietnam-ambience.ts`, the twelve `vn_` entries inside
`PAINTED_SIGNATURES` in `src/fw/scene-ambience.ts`, the two import lines in `scripts/tests/room-audit.html` and
`scripts/tests/rooms.html`, and this document. No world, prop, stand, story or `.mjs` test file was changed.
