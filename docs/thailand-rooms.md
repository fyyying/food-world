# Thailand rooms: the wide and portrait motion matrix

This is the Room maker's Stage C record for the twelve Thailand rooms of the Southeast Asia world. It covers
`src/fw/scenes-thailand.ts` (`THAILAND_SCENES`), `src/fw/thailand-ambience.ts` (`THAILAND_AMBIENCE` and
`THAILAND_HUNG`) and the twelve `th_` entries in `PAINTED_SIGNATURES` inside `src/fw/scene-ambience.ts`. The room
list, the empty hook per room, the sprite per room and the hot-and-cold list come from the "Shared contract: rooms"
section of [thailand-world.md](thailand-world.md) and Part B of [the image brief](thailand-image-brief.md). The
three discovery subjects and their texts are `THAILAND_DISCOVERIES` in `src/fw/thailand-stories.ts`, word for word;
this file supplies only the effect and the two anchors per touch.

Every coordinate in both files was read off the delivered file at that orientation, on a gridded crop of its own
pixels at 100 per cent zoom where precision mattered (every pour, every hook, every fire). No wide fraction was
converted into a portrait one. The wide painting is 1672 x 941 and maps to stage units as `x = fx * 1600`,
`y = fy * 900`. The portrait painting is 941 x 1672 and goes through `pAt(folder, fx, fy)`, which places it 512.2
stage units wide in the middle of the stage.

**The phone band.** A 390-wide viewport cover-fits the stage at `S = max(390/1600, 844/900) = .9378`, so it shows
415.9 of the portrait painting's 512.2 stage units: the visible slice is **x .094 to .906**. Every portrait patch
box, every portrait sprite and every portrait touch anchor in this area lies inside that slice, and the four boxes
that did not on the first pass were pulled in (see "Four phone boxes pulled inside the band"). Three painted hooks
sit outside it, and the rooms they belong to hang nothing in portrait; that is recorded per room.

## How to read the matrix

One row per room and orientation. Dominant cue names the room's `PAINTED_SIGNATURES` entry. Supporting cues are the
`THAILAND_AMBIENCE` patches, the `THAILAND_HUNG` sprites, the steam and the fire. Visibility is the share of the
frame that visibly changes in two seconds, measured with the `scripts/audit/room-motion.py` metric (`|ΔR|+|ΔG|+|ΔB|
> 24`) over six composite pairs per cell, phased across the engine's own drift cycle at frame offsets 60, 100, 140,
180, 220 and 260, as `docs/spain-rooms.md` records the method. The number is the median of the six and the range is
the weakest and strongest of them. Wide at 1280 x 720, portrait at 390 x 844.

### The floating market, `th_khlong`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The cleaver-opened young coconut with its water running into a cup on the thwart, the charcoal brazier of grilling bananas amidships, the bamboo cross-pole lashed across a canopy frame, the clean band of morning sky between that pole and the treeline | The same opened coconut pouring into a bamboo cup, the brazier at the left of the frame, the same cross-pole, the same band of sky |
| Boundary | Signature `stream-glint` [.484, .5225, .504, .637]; steam at the brazier pan (.615, .636) at 280, rate 10; hung `th-pla-tapian` fx .500 fy .0345 fw .073; hung `th-egret` fx .245 fy .062 fw .095. No ambience patch and no fire ellipse | Signature [.500, .518, .524, .612]; steam at the grill (.115, .452) at 190, rate 9; hung `th-pla-tapian` fx .555 fy .0225 fw .125; hung `th-egret` fx .195 fy .052 fw .125 |
| Anchor | The glint begins at the cut lip of the coconut at (.4905, .5225), follows the painted thread through (.493, .550) and (.4955, .600) and ends on the water surface in the cup at (.4965, .636). Nothing glints on the husk above the lip or below the cup's surface. The steam leaves the bananas on the brazier, not the fruit beside it. The fish mobile's thread meets the pole where the pole crosses x .5365 at y .0339 | The glint begins at the lip at (.512, .518), falls through (.512, .548) and (.510, .585) and ends on the bamboo cup's contents at (.508, .612). The steam leaves the grill at x .115, which is inside the phone band; the grill's left half runs off the slice a phone shows and is not anchored |
| Forbidden overlap | The paddler's hands and the coconut husk above the cut, the loaded fruit boats, the wat roof and chedi at x .60 to .76, the houses on posts along both banks | The seller's arm and the cut husks below the cup, the mangosteen and rambutan boat in the foreground, the chedi spire at x .66 to .74 |
| Dominant cue | The coconut water falling into the cup: the room's whole reason, traced lip to landing | The same pour on the portrait's own traced path |
| Supporting cues | The brazier's steam, the woven `pla tapian` mobile turning on the canopy pole, and one egret over the houses | The same three, measured on the portrait |
| Visibility | 3.38 per cent (3.16 to 4.76) | 5.46 per cent (4.48 to 6.36) |
| Browser status | Watched at 1280 x 720. The first placement put the fish at fx .3835 and the bird at fx .265, side by side in the same patch of sky, and the pair read as **two flying things**; the fish is now half a frame to the right on the pole with the bird's whole body clear of it, and the pole crosses above the fish's thread | Watched at 390 x 844. Both sprites are inside the band (fish x .555 to .680, bird x .195 to .320) and both draw |

### The noodle boat, `th_noodleboat`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The long ladle tipped out of the charcoal pot with broth falling into a bowl resting on a board, the pot itself on its open fire, the far half of the canal behind the boat | The same ladle and bowl, the pot in the foreground, the canal above the cook's shoulder |
| Boundary | Signature `stream-glint` [.542, .502, .562, .582]; steam at the pot (.560, .655) at 300 rate 10 and at the filled bowl (.553, .578) at 130 rate 8; `pot` ellipse (.560, .662) rx 128 ry 26; fire (.555, .845) rx 70 ry 14; `mist` [.62, .330, 1, .545] alpha .40 | Signature [.534, .472, .558, .557]; steam at the pot (.200, .585) at 200 rate 9 and the bowl (.545, .552) at 110 rate 7; `pot` (.200, .592) rx 150 ry 30; fire (.130, .755) rx 55 ry 14; `mist` [.28, .215, .52, .305] |
| Anchor | The glint begins at the ladle's rim at (.5535, .5025) and ends on the noodles in the bowl at (.549, .582), bending left as it falls | The same two endpoints on the portrait: lip (.548, .472), landing on the broth in the bowl at (.542, .5565) |
| Forbidden overlap | The cook's arm above the ladle, the eaters on the landing stage, the four open seasonings, the trays of raw noodles | The cook's sleeve, the strainer hanging at x .14, the stack of used bowls at the right edge |
| Dominant cue | The broth falling from the ladle into the bowl | The same fall, traced on the portrait |
| Supporting cues | Two plumes and a rolling boil on the pot, the open charcoal fire under it, and a low mist on the open half of the canal | The same four |
| Visibility | 4.34 per cent (3.51 to 4.84) | 12.08 per cent (9.37 to 13.32) |
| Browser status | Watched at 1280 x 720. **This room's empty iron hook on the awning's ridge pole at (.784, .055 to .122) carries nothing**, because the contract asks for no sprite here; it is the one empty fitting in the area that stays empty by design, not by accident | Watched at 390 x 844. The third touch sits on the stack of used bowls at x .900, which is four thousandths inside the band; it is the tightest anchor in the area and is recorded as such |

### The household kitchen, `th_wang`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The open side of the pavilion with daylight falling across the teak floor, the open clay pot of massaman on its charcoal stove, the iron peg in the carved teak post, the frangipani in the garden | The same open side, the same massaman pot high in the frame, the frangipani canopy |
| Boundary | Signature `sunray` [.34, 0, .88, .66], angles -.35, drift .090; steam at the massaman (.295, .385) at 200 rate 9; fire (.300, .535) rx 45 ry 12; hung `th-pla-tapian` fx .2365 fy .018 fw .060. No ambience patch with a wide box | Signature [.18, 0, .78, .52], angle +.32, drift .075; steam at the massaman (.780, .425) at 180 rate 9; `portrait: { fire: [] }`; six frangipani petals [.28, .02, .70, .26] |
| Anchor | The beam keeps the painting's own direction, in over the open side and down across the teak. The steam leaves the massaman's surface, where the painting already draws a wisp; the `khao chae` is iced and dry, and so are the carved pomelo and the chilli flower. The mobile's thread goes over the peg's tip at (.2665, .018) | The same beam on the portrait's own side. The steam leaves the same pot. The petals fall inside the painted frangipani and stop above the working women |
| Forbidden overlap | The four women at the low tables, the brass tray of `nam phrik`, the manuscript and the inkpot, the betel set | The carving hands and the chilli flower at (.31, .615), the tray at (.66, .69), the manuscript at (.74, .585), the inkpot at x .93 which the frame's own third marker avoids |
| Dominant cue | The daylight band across the pavilion floor | The same band |
| Supporting cues | The massaman's steam, the stove's open mouth, and the `pla tapian` mobile turning on the post | The massaman's steam and six frangipani petals. **No sprite**: the portrait's iron nail is at x .9145, past the right edge of the phone band, so a sprite that read at all would be cut in half on a phone |
| Visibility | 6.31 per cent (2.62 to 7.42) | 11.41 per cent (8.97 to 14.02) |
| Browser status | Watched at 1280 x 720. The mobile hangs against dark teak and pale frangipani, which separates it without any keying | Watched at 390 x 844. Three loops, which is inside the standard; the petals are the cue that replaces the sprite |

### The curry mortar, `th_curry`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The wide iron pan of coconut cream frying with its oil splitting in a ring, the open mouth of the clay stove under it, the bamboo rail slung under the floor joists, the sunlit yard beyond the open side | The same pan and stove seen from above, the same bamboo rail across the top of the frame, the same yard |
| Boundary | Signature `sunray` [.58, 0, 1, .62], angle -.30, drift .085; steam (.410, .415) at 200 rate 8; `pot` ellipse (.410, .425) rx 100 ry 18; fire (.410, .490) rx 50 ry 12; hung `th-garlic-string` fx .300 fy .095 fw .040 | Signature [.35, 0, .90, .44], angle +.30, drift .080; steam (.400, .468) at 150 rate 8; `pot` (.400, .472) rx 72 ry 13; fire (.385, .545) rx 40 ry 10; hung `th-garlic-string` fx .420 fy .062 fw .090 |
| Anchor | The plume and the boil ellipse sit on the cream's own surface inside the pan's rim; the granite mortar, the whole aromatics, the grated flesh and the cloth-covered first pressing are cold and carry nothing. The string's tie meets the rail where the rail crosses x .32 at y .095 | Same, with the pan higher in the frame. The string's tie meets the rail at x .465, y .062, which is the only clean span of that rail inside the phone band |
| Forbidden overlap | The pounding hands and the pestle, the grater stool and its bowl, the man crossing the yard | The mortar in the foreground, the pounding arm, the girl at the grater, the water jar |
| Dominant cue | The yard beyond the open side | The same |
| Supporting cues | The frying cream's plume and its boil, the stove's open mouth, and the garlic-and-shallot string swinging under the floor | The same four, measured on the portrait |
| Visibility | 5.54 per cent (2.34 to 6.25) | 11.32 per cent (7.73 to 14.12) |
| Browser status | Watched at 1280 x 720. The string hangs on the plain dark underside of the floor and reads cleanly | Watched at 390 x 844. Its portrait twin hangs over the yard's foliage, which is the only empty span of the rail inside the band; it reads, with less contrast than the wide one |

### The sweets kitchen, `th_sweets`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The perforated cone drawing unbroken `foi thong` threads down onto a wide brass pan of syrup at a low boil, the charcoal under the pan, the open door onto the lane at Kudi Chin | The same cone and pan from above, the same open door, the river and its boats beyond |
| Boundary | Signature `stream-glint` [.230, .455, .268, .640]; steam (.360, .612) at 240 rate 8; `pot` (.330, .620) rx 150 ry 26; fire (.355, .755) rx 62 ry 14; `sunray` [.60, 0, .92, .60] drift .090 | Signature [.350, .524, .432, .626]; steam (.240, .600) at 220 rate 8; `pot` (.230, .608) rx 170 ry 28; `portrait: { fire: [] }`; `sunray` [.58, 0, .90, .52] drift .085; `birds` [.62, .05, .90, .16] scale 1.4 period 7.5 |
| Anchor | The threads leave the cone's perforated tip at y .455 and land on the nest they have already made on the syrup at y .640, running at x .234 to .263. The plume rises from the open syrup right of that nest | The threads leave the tip at y .524 and land at y .626, running at x .355 to .428. The portrait frames the pan from above its stand and shows no charcoal, so it declares an empty fire list and spends the freed slot on the river sky |
| Forbidden overlap | The drawing hand and the cloth over the maker's shoulder, the child watching at x .33, the trays of `thong yip` and `thong yot`, the cooling rack, the bowl of yolks | The maker's arm, the trays of finished sweets, the rack of small cakes at (.78, .485), the bowl of yolks at (.775, .745) |
| Dominant cue | The golden threads falling onto the syrup | The same threads on the portrait's own path |
| Supporting cues | The syrup's plume and its low boil, the hearth under the pan, the doorway beam | The syrup's plume and boil, the doorway beam, and two gulls over the river |
| Visibility | 3.38 per cent (2.46 to 4.71) | 10.06 per cent (9.01 to 13.63) |
| Browser status | Watched at 1280 x 720. The threads read as threads rather than as a dashed line, because the box is the thread curtain's own width | Watched at 390 x 844 on the regenerated portrait, which is the one file in this area that was replaced after import; every portrait anchor here was measured on the new file, not carried over |

### The shophouse kitchen, `th_shophouse`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The wok tossed over a roaring charcoal ring, the open pot of congee, the lifted bamboo steamer, the brass hook under the arcade beam, the evening street | The same wok and ring, the congee pot and the steamer at the foot of the frame, the lit brass oil lamp on its bracket |
| Boundary | Signature `embers` [.15, .55, .40, .70]; steam at the wok (.245, .485) at 180 rate 9, the congee (.685, .800) at 190 rate 9 and the steamer (.850, .790) at 150 rate 8; `pot` (.685, .808) rx 105 ry 20; fire (.275, .655) rx 95 ry 20; hung `th-lantern` fx .9025 fy .165 fw .055 | Signature [.44, .655, .80, .77]; steam at the wok (.600, .600) at 170 rate 9, the congee (.160, .672) at 180 rate 9 and the steamer (.170, .800) at 150 rate 8; `pot` (.160, .680) rx 150 ry 26; fire (.620, .715) rx 75 ry 16; `light` [.374, .190, .436, .230] |
| Anchor | The sparks rise inside the flame the painting draws round the wok's rim, and nowhere else. The three plumes sit on the noodles, the congee's breaking surface and the open steamer's buns; the glazed jars and the tin tray of condiments are cold. The lantern's wire loop sits in the curve of the painted brass hook at (.930, .165) | Same, with the wok high and the congee and steamer in the foreground. The glow sits on the brass lamp's own glass |
| Forbidden overlap | The cook's two hands and the ladle, the roast duck and crisp pork on their hooks over the block, the chopper at the block, the marble tables and the arcade | The cook's face and arms, the hanging ducks at (.70, .26), the chopper at the right, the two drinkers below the lamp |
| Dominant cue | Sparks off the charcoal ring the wok's flame rises from | The same sparks |
| Supporting cues | Three plumes, a rolling boil on the congee, the fire round the wok, and the unlit paper lantern swinging on the arcade hook | Three plumes, the boil, the fire, and the brass lamp breathing on its bracket. **No sprite**: the portrait's brass hook runs x .888 to .900 and any lantern wide enough to read would cross x .906 |
| Visibility | 6.54 per cent (5.73 to 7.28) | 17.65 per cent (15.80 to 19.27) |
| Browser status | Watched at 1280 x 720. The lantern hangs on the painted hook against the timber post and the blue hour beyond, toned to .78 so it sits in the painting's own light | Watched at 390 x 844. The first `light` box here was [.295, .235, .375, .315], which is blank plaster and the tops of two drinkers' heads; it was re-read on `portrait.jpg` and moved onto the lamp's glass and bracket |

### The rice-field lunch, `th_paddy`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The banana leaf peeled back off the fish on a small fire of rice straw, the just-opened basket of steamed rice, the straw fire itself, and the hazy horizon over the flooded squares | The same opened fish, the same rice basket, the same fire, the same hazy horizon |
| Boundary | Signature `mist` [.12, .175, .80, .255] alpha .42; steam at the fish (.400, .625) at 220 rate 9 and the rice basket (.620, .615) at 140 rate 8; fire (.450, .695) rx 55 ry 12; hung `th-egret` fx .300 fy .035 fw .100 | Signature [.10, .130, .88, .215]; steam at the fish (.450, .665) at 170 rate 8 and the basket (.550, .545) at 90 rate 7; fire (.490, .748) rx 45 ry 12; hung `th-egret` fx .220 fy .038 fw .170 |
| Anchor | The haze sits on the far paddy between the bund and the treeline, never on the family. The plumes leave the white flesh inside the opened leaf and the rice inside the opened basket; the morning glory, the cucumber, the cut banana flower and the water gourd are cold. The egret flies in the clean band of pale sky the brief asked for, crossing in front of the far treeline | Same, with the bird larger in the taller sky the portrait opens |
| Forbidden overlap | The five people on the bund, the clay mortar of `nam phrik` at (.515, .635), the sickle, the buffalo standing in the far square at x .85 to .98 | The three faces, the mortar at (.72, .545), the buffalo at x .60 to .74, the bamboo pole at the right edge |
| Dominant cue | The heat haze over the flooded squares | The same haze |
| Supporting cues | Two plumes, the straw fire, and one egret over the paddy | The same four |
| Visibility | 4.08 per cent (3.52 to 4.35) | 11.12 per cent (9.58 to 13.48) |
| Browser status | Watched at 1280 x 720. The egret is the cue that reads best in the area: a large white bird in a wide open sky, which is what the image brief reserved that band for | Watched at 390 x 844. **The empty bamboo pole and cross-piece on the bund carries nothing**, exactly as the Stage B acceptance note predicted: it sits at about x .93 in portrait, outside the band, and this room's sprite is the bird, which needs no pole |

### The Isan grill, `th_isan`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The long charcoal trough with three flattened chickens in split-bamboo clamps over it, the two just-opened baskets of sticky rice, the bamboo grove beyond the fence, the empty bamboo rail | The same trough higher in the frame, the same baskets, the same grove, the clean empty rail across the top |
| Boundary | Signature `leaves` [.02, 0, .30, .26], `olive`, `#7f9a4e`, count 8, size 1.6; steam at the two baskets (.135, .625) at 160 rate 8 and (.275, .635) at 140 rate 8; fire (.620, .775) rx 90 ry 14; hung `th-garlic-string` fx .270 fy .150 fw .050 | Signature [.62, .02, .90, .28]; steam at the baskets (.710, .695) at 95 rate 7 and (.105, .690) at 90 rate 7; fire (.600, .412) rx 65 ry 12; hung `th-garlic-string` fx .680 fy .062 fw .090 |
| Anchor | The leaves fall inside the painted bamboo and stop at the fence. The plumes leave the white rice inside the two open baskets; **the `pla ra` jars against the house posts are cold and carry nothing at all**, which the room's own text requires. The string's tie meets the garden fence rail where the rail crosses x .295 at y .150, over gold paddy | Same, with the grove on the portrait's own side and the string's tie on the clean rail at x .725, y .062 |
| Forbidden overlap | The grandmother and the two children, the clay mortar of papaya at (.38, .60), the row of jars from x .80, the loom | The pounding woman and the pestle, the mortar at (.40, .665), the man at the grill, the jars at the right edge |
| Dominant cue | Bamboo leaves turning out of the grove | The same leaves |
| Supporting cues | Two rice plumes, the charcoal trough, and the garlic-and-shallot string on the fence rail | The same four |
| Visibility | 4.47 per cent (4.01 to 4.83) | 9.36 per cent (8.07 to 11.19) |
| Browser status | Watched at 1280 x 720. The wide box was [.02, 0, .24, .21] at size 1.4 and the room measured 2.68 per cent; widened to the grove's full span at size 1.6 it measures 4.47, with its weakest sample above the floor | Watched at 390 x 844. The portrait rail is the cleaner of the two, as the Stage B note said, and the string hangs against the grove |

### The Lanna kitchen, `th_lanna`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The open pot of khao soi broth with its oil split orange, the bowl being filled and the finished bowl in the foreground, the coil of `sai ua` on its low charcoal grill, the iron hook in the teak plank wall, the cool daylight through the open side | The same pot and bowls, the same coil and grill, the same open side, and a ladle of broth falling into the bowl |
| Boundary | Signature `sunray` [.42, 0, .98, .66], angle -.38, drift .090; steam at the pot (.130, .595) at 200 rate 9, the lifted bowl (.200, .425) at 100 rate 7 and the front bowl (.255, .815) at 130 rate 7; `pot` (.130, .604) rx 130 ry 24; fire (.440, .468) rx 52 ry 10; hung `th-sai-ua` fx .9185 fy .148 fw .055 | Signature [.24, 0, .86, .46], angle +.34, drift .080; steam at the pot (.150, .620) at 190 rate 9, the bowl being filled (.310, .545) at 90 rate 7 and the front bowl (.330, .775) at 130 rate 7; `pot` (.150, .628) rx 160 ry 26; fire (.800, .548) rx 60 ry 12; `stream-glint` [.302, .502, .325, .536] |
| Anchor | The beam keeps the painting's cool morning direction. The plumes leave the broth's split surface and the two bowls of noodles; the pickled mustard greens, the drying `thua nao` discs and the `khantoke`'s cold dishes carry nothing. The sausage's own S-hook sits in the curve of the painted iron hook at (.946, .148) | The glint begins at the ladle's rim at (.3105, .5025), bends right as it falls and ends on the noodles at (.3175, .5345). Nothing is drawn above the rim or below the noodle surface |
| Forbidden overlap | The woman at the bowl and her tongs, the older woman at the grill, the Chin Haw muleteer in the opening, the lacquered tray on the floor | The pourer's hand and sleeve, the crisp noodle nest at (.33, .79), the coil at (.80, .495), the lacquered tray at (.55, .645) |
| Dominant cue | The cool daylight through the open side | The same beam |
| Supporting cues | Three plumes and a rolling boil, the grill's charcoal, and the `sai ua` coil turning on its hook | Three plumes, the boil, the grill's charcoal, and the ladle's pour. **No sprite**: the portrait's iron hook bends at x .890, and a coil wide enough to read would cross x .906 |
| Visibility | 8.38 per cent (4.27 to 9.85) | 17.51 per cent (13.92 to 19.16) |
| Browser status | Watched at 1280 x 720. The coil hangs on an evenly lit pale plank, which is what the brief asked the painter for and it is the cleanest background of the six hooks | Watched at 390 x 844. The pour is the cue the portrait gains in place of the sprite, and it is the only pour in the area that exists in one orientation only, because the wide composition shows the same woman lifting noodles **out** of the bowl rather than pouring into it |

### The Andaman fishing kitchen, `th_andaman`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The open pot of `kaeng som`, the turmeric-rubbed fish on the green-stick grill over driftwood coals, the second empty line strung between the poles beside the painted squid, and the midday haze on the green water at the foot of the karsts | The same pot and grill, the same empty rope across the top of the frame, the same haze |
| Boundary | Signature `mist` [.42, .18, .95, .30] alpha .46; steam at the pot (.510, .615) at 170 rate 9 and the grilling fish (.270, .700) at 140 rate 7; fire (.300, .790) rx 90 ry 16; hung `th-squid-line` fx .320 fy .070 fw .095 | Signature [.33, .295, .88, .385]; steam at the pot (.820, .680) at 160 rate 9 and the fish (.280, .685) at 150 rate 7; fire (.280, .795) rx 55 ry 12; hung `th-squid-line` fx .300 fy .052 fw .280 |
| Anchor | The haze sits on the water between the karst bases and the boats, never on the sand or the fire. The plumes leave the sour curry's surface and the blistering skin of the fish; **the split squid drying on the painted line is cold and carries nothing**, and so do the `sataw`, the stone mortar and the opened coconut. The sprite's twine ends sit on the empty rope, which runs from (.19, .085) to (.60, .057), and the sprite stops at y .224, clear of the painted squid at y .225 | Same, with the rope running from (.06, .052) to (.90, .045) and the sprite hanging from it at x .300 to .580 |
| Forbidden overlap | The two women at the fire, the man mending the net, the child with the basket, the boats drawn up on the sand, the painted squid line at y .225 to .310 | The painted squid line, which runs off the left edge of the portrait, so the second touch is on the squid at x .20 rather than on the end of the line; the cook's arm; the baskets in the foreground |
| Dominant cue | The haze on the green water | The same haze |
| Supporting cues | Two plumes, the driftwood fire, and a second line of squid drying beside the painted one | The same four |
| Visibility | 3.34 per cent (3.06 to 4.06) | 15.55 per cent (14.44 to 16.00) |
| Browser status | Watched at 1280 x 720. Two lines of drying squid, one painted and one hung, read as what the brief asked for rather than as a duplicate: the hung one is on its own empty rope above the painted one and stops short of it | Watched at 390 x 844. **No egret here.** The room contract lists one for this room, and there is no slot for it: the haze, the steam, the fire and the squid line are already four loops, and the squid line is the sprite the room was painted for |

### The Malay-Muslim kitchen, `th_muslim`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The open pot of `khao mok` with its lid resting against it, the `roti` puffing on the charcoal-fired steel plate, the low sun over the mangrove and the clean band of evening sky above it | The same pot and plate, the sun setting over the water, the same band of sky |
| Boundary | Signature `sunray` [.46, 0, 1, .66], angle +.34, drift .095; steam at the `khao mok` (.175, .572) at 230 rate 10 and the roti (.520, .585) at 190 rate 8; fire (.490, .662) rx 45 ry 10; `birds` [.62, .055, .95, .16] scale 1.8 period 6.5 | Signature [.32, 0, .90, .52], angle +.30, drift .085; steam at the pot (.130, .485) at 150 rate 9 and the roti (.680, .612) at 120 rate 7; fire (.650, .675) rx 55 ry 9; `birds` [.58, .135, .90, .215] |
| Anchor | The beam keeps the painting's own low evening direction, in from the water. The plumes leave the yellow rice inside the open pot and the puffing roti on the plate; **the `budu` jar with its ladle is cold and carries nothing** — it is never boiled — and neither do the `nasi kerabu`, the massaman bowl or the raw aromatics on the board. The birds cross the clean sky between the mosque roof and the mangrove | Same, with the sun visible in the portrait's own sky band |
| Forbidden overlap | The thrown roti disc and the maker's two hands, the three women, the two children on the step, the stilt houses across the water | The roti maker's arms and the thrown disc, the budu jar at (.14, .645), the folded prayer mat at the foot of the frame |
| Dominant cue | The low sun through the open cooking side | The same |
| Supporting cues | Two plumes, the charcoal under the steel plate, and two birds over the mangrove | The same four |
| Visibility | 7.87 per cent (4.50 to 8.10) | 16.43 per cent (9.47 to 17.92) |
| Browser status | Watched at 1280 x 720. This room signed with `birds` until the wide painting measured **2.55 per cent** against a 3 per cent floor; two silhouettes are a rounding error in a changed-pixel count, and the low light the room is painted in is the largest thing it does, so the two changed places and the room now measures 7.87 | Watched at 390 x 844. **This is the one room in the area with no hanging sprite at all**, by the contract: its empty peg on the plank wall stays empty, and both orientations spend their loops on heat and sky |

### The tin town kitchen, `th_baba`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The open clay pot of `moo hong`, the tiffin tier lifted clear of its stack, the bowl of `mee Hokkien`, the `o-tao` frying on the flat iron plate over charcoal, the iron hook under the airwell beam, and the airwell's shaft of last daylight on the tiles | The same four hot things, the same hook at mid-width, the same shaft |
| Boundary | Signature `sunray` [.36, 0, .72, .58], angle +.25, drift .090; steam at the clay pot (.435, .760) at 200 rate 9, the iron plate (.120, .720) at 170 rate 9, the lifted tier (.385, .285) at 90 rate 7 and the noodle bowl (.665, .752) at 120 rate 7; fire (.145, .848) rx 55 ry 12; hung `th-lantern` fx .519 fy .128 fw .060 | Signature [.26, 0, .72, .50], angle +.22, drift .085; steam at the clay pot (.300, .700) at 200 rate 9, the iron plate (.780, .845) at 150 rate 8, the tier (.310, .490) at 90 rate 7 and the noodle bowl (.720, .752) at 120 rate 7; fire (.370, .788) rx 45 ry 10; hung `th-lantern` fx .425 fy .130 fw .140 |
| Anchor | The shaft keeps the airwell's own direction, down onto the patterned tiles. Four plumes, which is the engine's cap: the braise, the lifted tier, the noodle gravy and the oyster fry; **the blue-and-white Nyonya porcelain and the young mango are cold**. The lantern's loop sits in the J of the painted hook at (.549, .128), which hangs from the beam on its own long stem | Same, with the hook at (.495, .115), at mid-width and well inside the phone band |
| Forbidden overlap | The woman lifting the tier and her two hands, the man at the iron plate, the older woman at the marble table, the two children, the carved screen and the ancestral niche | The lifting hands, the bentwood chairs, the stained-glass arch below the lantern, the tin sluice on the hill |
| Dominant cue | The airwell's shaft of last daylight | The same shaft |
| Supporting cues | Four plumes, the charcoal under the iron plate, and the paper lantern swinging under the airwell beam | The same six |
| Visibility | 9.67 per cent (6.85 to 11.08) | 25.94 per cent (22.18 to 26.59) |
| Browser status | Watched at 1280 x 720. This is the busiest room in the area and the strongest cell in the matrix; the four plumes carry it and the lantern is the one thing a visitor sees move against a still wall | Watched at 390 x 844 |

## Loop counts

Twelve rooms, three or four always-on loops in both orientations, counted the way `room-loops.mjs` counts them
(signature + steam + fire + ambience patches the engine keeps + hung sprites that carry a `sway`). The engine's
`choose` in `scene-painted.ts` slices the ambience list to `3 - heat`, so a room that steams and burns keeps exactly
one patch; a hung sprite is counted on top of that, which is why several rooms below carry no ambience patch at all
in one orientation or in both.

| Room | Wide | Portrait |
| --- | --- | --- |
| `th_khlong` | 4: glint, steam, 2 sprites | 4: glint, steam, 2 sprites |
| `th_noodleboat` | 4: glint, steam, fire, mist | 4: glint, steam, fire, mist |
| `th_wang` | 4: sunray, steam, fire, sprite | 3: sunray, steam, leaves |
| `th_curry` | 4: sunray, steam, fire, sprite | 4: sunray, steam, fire, sprite |
| `th_sweets` | 4: glint, steam, fire, sunray | 4: glint, steam, sunray, birds |
| `th_shophouse` | 4: embers, steam, fire, sprite | 4: embers, steam, fire, light |
| `th_paddy` | 4: mist, steam, fire, sprite | 4: mist, steam, fire, sprite |
| `th_isan` | 4: leaves, steam, fire, sprite | 4: leaves, steam, fire, sprite |
| `th_lanna` | 4: sunray, steam, fire, sprite | 4: sunray, steam, fire, glint |
| `th_andaman` | 4: mist, steam, fire, sprite | 4: mist, steam, fire, sprite |
| `th_muslim` | 4: sunray, steam, fire, birds | 4: sunray, steam, fire, birds |
| `th_baba` | 4: sunray, steam, fire, sprite | 4: sunray, steam, fire, sprite |

**`room-loops.mjs` does not see these rooms.** Its `input` map names `scenes-china.ts`, `scenes-turkey.ts` and
`scenes-spain.ts`, and its stub resolver matches `/scenes-(china|turkey|spain)\.ts$/`; neither is this role's file
to edit. The counts above were produced by a copy of that harness restricted to Thailand, run from the repository
root, which prints the same `loops= steam= fire= hung=` line per room and asserts the same 3-to-4 band. Adding
`thailand: 'src/fw/scenes-thailand.ts'` to the harness's inputs, `thailand` to the imported list, `th.THAILAND_SCENES`
to the `all` merge and `thailand` to the resolver regex is a four-word change and belongs to whoever owns that file.

## Every pictured hot vessel steams, and half this area does not

Twenty-eight steam sources across twenty-four paintings, and the engine's cap of four per orientation is reached
only in `th_baba`. Fire ellipses sit where flames are pictured: the noodle boat's charcoal, the curry stove's open
mouth, the sweets hearth (wide only), the wok's ring, the straw fire, the Isan trough, the Lanna grill, the
driftwood fire, the charcoal under the Malay steel plate, the charcoal under the Baba iron plate, and the wang
stove (wide only). Boiling and frying surfaces also carry a `pot` ellipse: the boat's broth, the frying coconut
cream, the syrup, the congee and the khao soi pot.

Three orientations declare an **empty** `portrait: { fire: [] }` rather than inheriting the wide flame, because the
portrait composition does not show it: `th_wang` (the girl's charcoal stove sits at x .06, left of the phone band),
`th_sweets` (the pan is framed from above its stand) and, in the mirror of those, nothing in `th_khlong`, which
declares no fire in either orientation because the brazier's coals are a sliver under the pan in wide and hidden
behind the pot's rim in portrait.

**What was measured and left dry.** This was the area's own rule before a line of it was written, because half of
it is cold on purpose (thailand-world.md, "Shared contract: rooms"):

- **`th_khlong`**: every boat of mangosteen, rambutan, mango, banana and durian; the bundles of morning glory,
  banana blossom, pea aubergine, galangal and lemongrass; the banana-leaf parcels; the salted duck eggs in their
  basket of mud; the young coconut itself. Only the brazier emits.
- **`th_wang`**: the `khao chae`, which is rice in iced scented water and is the whole point of the dish; the carved
  pomelo and the chilli flower; the betel set; the manuscript and the inkpot.
- **`th_curry`**: the granite mortar and its half-made paste, the whole aromatics beside it, the grated flesh on the
  grater stool, and the cloth-covered bowl of first-pressing cream. Only the pan on the fire emits.
- **`th_isan`**: the row of glazed `pla ra` jars against the house posts, which the image brief names twice as cold;
  the `larb` on its board, the long beans, the tomato, the lime halves and the palm sugar.
- **`th_andaman`**: the split squid drying on the line, the `sataw` beans, the stone mortar of turmeric paste, the
  opened coconut and the covered basket of rice.
- **`th_muslim`**: the `budu` jar with its wooden ladle, which is fermented and never boiled; the `nasi kerabu`, the
  massaman bowl, the board of raw aromatics and dried fish, the folded prayer mat.
- **`th_baba`**: the blue-and-white Nyonya porcelain, the young mango, the brass spittoon.
- **`th_sweets`**: the finished `foi thong` skein, the `thong yip`, the `thong yot`, the cooling rack of small cakes
  and the bowl of separated duck-egg yolks. Only the syrup pan emits, and the baking tray's embers are the fire.

Nothing held in a hand emits anywhere in the area, which is the rule the Spain paella room stated and this one
keeps: the bowls the diners hold in `th_paddy` and `th_lanna`, the rice balls in the children's fingers, and the
cup the coconut water is still falling into all stay dry until the liquid reaches them.

## Breeze masks

**Thailand ships no `breeze` crop, and it never needed one.** The image brief asked every painting for an empty
hook, pole, rail, line, peg or nail against a plain background and for the hanging object to arrive as a separate
keyed sprite, so the hanging motion in this area is a delivered sprite laid over a picture that already has clean
wall, plank, sky or paddy behind it. Nothing is cut out of a finished painting and no wall has to be repaired, so
`scripts/audit/breeze-masks.py` renders nothing new for this area and its count is unchanged.

That is the standard the Spain pass ended on after eleven crops were withdrawn on 2026-09-16, and the difference
here is only that it was reached by the pictures rather than by a paint-out: Spain had to run
`scripts/scenes/paint-out-strings.py` over four compositions to get a clean wall behind its `es-pepper-ristra`,
and no Thailand painting needed it.

## Sprites

Six delivered, six used, in fifteen room orientations.

| Sprite | Rooms and orientations | Painted fitting it hangs from |
| --- | --- | --- |
| `th-pla-tapian` | `th_khlong` wide and portrait, `th_wang` wide | The bamboo cross-pole on the canopy frame; the iron peg in the carved teak post |
| `th-egret` | `th_khlong` wide and portrait, `th_paddy` wide and portrait | None: it flies in the clean band of sky the brief reserved for it in both rooms |
| `th-garlic-string` | `th_curry` wide and portrait, `th_isan` wide and portrait | The bamboo rail under the floor joists; the bamboo fence rail and the rail across the portrait's top |
| `th-lantern` | `th_shophouse` wide, `th_baba` wide and portrait | The brass hook under the arcade beam; the iron hook under the airwell beam |
| `th-sai-ua` | `th_lanna` wide | The iron hook in the teak plank wall, through the sprite's own S-hook |
| `th-squid-line` | `th_andaman` wide and portrait | The second, empty line strung between the poles beside the painted one |

**Three orientations the room contract lists a sprite for carry none, and the reason is the same in all three: the
painted fitting sits at or past x .906.** `th_wang` portrait (the iron nail at x .9145), `th_shophouse` portrait
(the brass hook at x .888 to .900) and `th_lanna` portrait (the hook's bend at x .890). A sprite hangs centred under
its fitting, so any width that reads at all would cross the right edge of the slice a 390-wide viewport shows and be
cut in half on a phone. Each of the three empty fittings stays empty, and each room's portrait spends that loop on a
patch instead: frangipani petals in `th_wang`, the brass oil lamp in `th_shophouse`, and the ladle's pour in
`th_lanna`.

**Two departures from the sprite column in `docs/thailand-world.md`, both under the four-loop ceiling.** That table
lists `th_motion_egret` for `th_andaman` as well as `th_khlong` and `th_paddy`: `th_andaman` already carries the
haze, two plumes, the driftwood fire and the squid line its painting was composed around, and a fifth loop is above
the ceiling, so the bird is not hung there. And `th_noodleboat`'s empty iron hook on the ridge pole carries nothing,
which is the contract's own "Sprites: none" for that room rather than an omission.

`th-garlic-string` measures 342 x 960 px after trimming, below the 400 px short side the art direction asks for, as
the Stage B acceptance note recorded. It is hung small in all four orientations — .040 and .050 of the wide
painting's width, .090 of the portrait's — so nothing is upscaled past its own resolution.

## Four phone boxes pulled inside the band

`paintingFrame(true, 415.9)` puts the visible slice of a portrait painting at x .094 to .906. Four boxes ran past
the right end of it on the first pass and were pulled in on 2026-09-22:

| Box | Was | Now |
| --- | --- | --- |
| `th_curry` signature `sunray` | [.35, 0, .92, .44] | [.35, 0, .90, .44] |
| `th_isan` signature `leaves` | [.62, .02, .92, .28] | [.62, .02, .90, .28] |
| `th_muslim` signature `sunray` | [.34, 0, 1, .52] | [.32, 0, .90, .52] |
| `th_sweets` doorway `sunray` | [.58, 0, .98, .52] | [.58, 0, .90, .52] |

The `th_muslim` box mattered most and is worth stating as a rule: `drawAmbience` fades a `sunray` out over the last
fifth of any box edge that is **not** the painting's own edge, and does not fade an edge at 1.0. A phone-side box
that ran to 1.0 therefore had no fade at all and would have been **cut off square in mid-air** at x .906, which is
the straight cut across a sunbeam the Stage E2 list names. Every phone box in this area now ends at or before .906
so the engine's own fade does the work.

## Measured motion

Method. The dev server at `http://localhost:5180`, `scripts/tests/rooms.html`, with the room built directly from
`THAILAND_SCENES` and ticked by hand at a fixed 1/60 s so the measurement does not depend on the Browser pane being
displayed (a hidden pane stops `requestAnimationFrame` altogether, which is what `__fw.step` exists to work round in
the main app). Per cell: 60 frames of warm-up, then six pairs, each preceded by a different offset — 60, 100, 140,
180, 220, 260 frames — so the pairs land at different points of the 22.4 s drift cycle, then two composites two
simulated seconds apart, then the `room-motion.py` metric over them. The median of the six is the number recorded.

| Room | Wide at 1280 x 720, median (range of six) | Portrait at 390 x 844, median (range of six) | Floor |
| --- | --- | --- | --- |
| `th_khlong` | 3.38 (3.16 to 4.76) | 5.46 (4.48 to 6.36) | 3% |
| `th_noodleboat` | 4.34 (3.51 to 4.84) | 12.08 (9.37 to 13.32) | 3% |
| `th_wang` | 6.31 (2.62 to 7.42) | 11.41 (8.97 to 14.02) | 3% |
| `th_curry` | 5.54 (2.34 to 6.25) | 11.32 (7.73 to 14.12) | 3% |
| `th_sweets` | 3.38 (2.46 to 4.71) | 10.06 (9.01 to 13.63) | 3% |
| `th_shophouse` | 6.54 (5.73 to 7.28) | 17.65 (15.80 to 19.27) | 3% |
| `th_paddy` | 4.08 (3.52 to 4.35) | 11.12 (9.58 to 13.48) | 3% |
| `th_isan` | 4.47 (4.01 to 4.83) | 9.36 (8.07 to 11.19) | 3% |
| `th_lanna` | 8.38 (4.27 to 9.85) | 17.51 (13.92 to 19.16) | 3% |
| `th_andaman` | 3.34 (3.06 to 4.06) | 15.55 (14.44 to 16.00) | 3% |
| `th_muslim` | 7.87 (4.50 to 8.10) | 16.43 (9.47 to 17.92) | 3% |
| `th_baba` | 9.67 (6.85 to 11.08) | 25.94 (22.18 to 26.59) | 3% |

Every room is a heat room — all twelve picture a hot vessel — so every cell owes 3 per cent, not the 2.5 an outdoor
room owes, and every cell clears it on the median. Four wide cells did not on the first measurement and were
strengthened before this table was taken:

| Cell | First pass | Now | What changed |
| --- | --- | --- | --- |
| `th_khlong` wide | 2.21 (1.90 to 2.36) | 3.38 (3.16 to 4.76) | The brazier plume from 180 to 280 at rate 10; the `pla tapian` from fw .055 to .073 and sway 5.0 to 6.5; the egret from fw .075 to .095 and sway 3.4 to 4.6; then both sprites moved apart after the live look |
| `th_noodleboat` wide | 2.85 (2.44 to 3.21) | 4.34 (3.51 to 4.84) | The pot's plume from 230 to 300 at rate 10 and the bowl's from 110 to 130; the canal mist from [.68, .375, .99, .50] to [.62, .330, 1, .545] at alpha .40 |
| `th_isan` wide | 2.68 (2.44 to 3.16) | 4.47 (4.01 to 4.83) | The bamboo-leaf box widened to the grove's full span and the leaves from size 1.4 to 1.6; the two rice plumes from 100 and 90 to 160 and 140 at rate 8; the garlic string from fw .042 to .050 and sway 3.8 to 5.4 |
| `th_muslim` wide | 2.55 (2.23 to 3.10) | 7.87 (4.50 to 8.10) | The signature and the ambience patch changed places: the low sun the room is painted in became the `sunray` signature and the mangrove birds took the one ambience slot, larger (scale 1.8) and more frequent (period 6.5). The `khao mok` plume went from 160 to 230 at rate 10 and the roti's from 130 to 190 |

`th_paddy` wide was over its floor at 3.07 but with its weakest sample at 2.50; its two plumes were widened to 220
and 140 in the same pass and it now measures 4.08 with a weakest sample of 3.52. Two more cells have a weak sample
under floor while their medians are comfortably over it — `th_wang` wide (2.62) and `th_curry` wide (2.34) — and
both are the `sunray` stall that `docs/spain-rooms.md` records as a property of the effect rather than of the box:
`drawAmbience` moves the beam by `sin(t * .28)`, whose travel passes through zero twice every 22.4 s. Both rooms
carry a plume, a flame and a swinging sprite beside the beam, so neither ever stops moving on screen.

**One caveat on the portrait numbers, carried over from `docs/spain-rooms.md` and true here for the same reason.**
The composite is `LivingScene.snapshot()`, which draws each layer stretched into the element rectangle, so a
portrait composite holds the whole 1600 x 900 stage squashed into 390 x 844 with the painting in a central band and
the mirrored blurred back layer either side. Effects are drawn inside that same squashed frame, so the portrait
percentages are comparable with each other and with Spain's, but they are not the share of a phone screen that
changes. Every portrait cell was also looked at, unsquashed, on its own painting band.

## Verification

- `npm run typecheck` is clean.
- `npm test`: 20 of 21 harnesses pass. `thailand-reactions.mjs`, `thailand-world.mjs`, `room-loops.mjs`,
  `room-controls.mjs`, `prop-reactions.mjs`, `recipe-addon.mjs` and the rest are green.
- **One harness fails, on one stale number, and it is not this role's file.** `scene-ambience.mjs:57` asserts
  `Object.keys(PAINTED_SIGNATURES).length === 65`. The twelve `th_` entries and the Vietnam Room maker's twelve
  `vn_` entries take it to 89. Every other assertion in that harness passes with all 89 signatures present, checked
  by running it once with the literal changed to 89 and then restoring the file byte for byte: it prints
  `PASS: 65 paired signatures, painting-native China/Turkey/Xinjiang motion, tight hanging layers, bounded geometry,
  reduced motion, orientation reset, and readable ambience.` The per-signature loop in it is what matters, and it
  holds for every Thailand entry: both orientations have a four-number anchor inside the painting, every
  `stream-glint` has an explicitly traced path per orientation, every signature draws visible geometry at both
  widths, changes with time, restores the canvas state and stays inside the drawing budget.
- The twelve rooms were registered in `scripts/tests/room-audit.html` and `scripts/tests/rooms.html` beside the
  Vietnam agent's line, and every one of them shows in both orientations.
- Every phone patch box, every phone sprite and every phone touch anchor was checked against the x .094 to .906
  band arithmetically, and the room's own effect canvas was read live at 390 x 844 for all twelve: every room draws
  lit pixels, every portrait-only sprite's bounding rectangle lies inside 0 to 390 CSS px, and every portrait fire
  ellipse is on screen with a moving opacity.
- Every touch anchor was checked on an overlay of its own painting in both orientations, with the steam anchors
  drawn beside them. Two were moved after that look: `th_khlong` wide's first touch from (.490, .545), which sat on
  the falling water rather than on the coconut, to (.472, .495), and its third from (.400, .655), which sat on the
  whole green coconuts above the cut ones, to (.420, .745).
- Contact sheet of all twelve rooms, wide and portrait with the effect canvas composited in:
  `scratchpad/thailand-rooms-live.png`.

## Status

Built: all twelve rooms in `src/fw/scenes-thailand.ts` as `paintedScene` configs with three touches each,
thirty-six in total, each naming a subject visible in both paintings and carrying the `THAILAND_DISCOVERIES`
sentence word for word; the per-orientation ambience and the fifteen hung sprites in
`src/fw/thailand-ambience.ts`; and the twelve `th_` signature entries in `PAINTED_SIGNATURES`. Effects on the
touches are `detail` on cold subjects, `tea` on a pictured steaming vessel and `sizzle` at a pictured fire or hot
plate; no `light`, `leaves`, `water`, `flour` or `chime` touch was needed.

Not verified, and it should be said plainly:

- **Nothing was seen through the world route**, because there is no world route yet: `graph.ts` does not register
  the Thailand objects until Stage D, so every room was opened directly from `THAILAND_SCENES` in `rooms.html`. The
  arrival flight, the card chain and the "The story" button were not exercised.
- **Reduced motion was not verified in the browser** for these rooms. The engine reads the preference on every tick
  in `scene-props.ts`, `scene-painted.ts` and `scene.ts`, and no Thailand cue is outside that path, but that is a
  claim about the engine and not a measurement of this area.
- **`scripts/audit/room-motion.py` was not the tool that produced the numbers.** Its metric was, implemented in the
  page so the measurement could run with the pane hidden; the script itself reads `.data/shots` pairs written by
  `__fw.sceneShot`, which belongs to the main app and not to `rooms.html`. The pairs behind this table were not
  written to disk.
- The rooms have not been looked at on a large screen or on a physical phone.
- `scripts/audit/breeze-masks.py` was not run, because this area has no crop for it to render.

Left for the lead:

1. **`scripts/tests/scene-ambience.mjs:57` needs its count taken from 65 to 89**, now that Thailand's twelve and
   Vietnam's twelve are both in `PAINTED_SIGNATURES`. One literal.
2. **`scripts/tests/room-loops.mjs` does not audit Thailand or Vietnam.** It needs `thailand` (and `vietnam`) in its
   `input` map, in the imported list, in the `all` merge and in the stub resolver's regex, or the four-loop ceiling
   these rooms were built to is checked by nothing in `npm test`.
3. Record the twenty-four figures above in `docs/quality-baseline.md`.
4. Decide whether `th_noodleboat`'s empty ridge-pole hook and the three portrait fittings outside the phone band are
   worth a sprite or a regeneration, or whether they stay empty as they are here.
