# Britain rooms: the wide and portrait motion matrix

This is the Room maker's Stage C record for the thirteen Britain rooms (area id `london`, displayed as Britain). It
covers `src/fw/scenes-london.ts` (`LONDON_SCENES`), `src/fw/london-ambience.ts` (`LONDON_AMBIENCE` and
`LONDON_HUNG`) and the thirteen `uk_` entries in `PAINTED_SIGNATURES` inside `src/fw/scene-ambience.ts`. The room
list, the empty fitting per room, the sprite per room and the rule that `uk_dairy` is cold come from "Shared
contract: rooms" and the Stage B acceptance table in [london-world.md](london-world.md). The three discovery
subjects and their texts are `LONDON_DISCOVERIES` in `src/fw/london-stories.ts`, word for word; this file supplies
only the effect and the two anchors per touch.

Every coordinate in both files was read off the delivered file at that orientation. No wide fraction was converted
into a portrait one. The wide painting is 1672 x 941 and maps to stage units as `x = fx * 1600`, `y = fy * 900`;
the portrait painting is 941 x 1672 and goes through `pAt(folder, fx, fy)`. Every pour and every fitting was read on
a gridded crop of the file's own pixels (`scratchpad/grid.py`, `montage.py`), and the pie shop's two liquor threads
were traced row by row with a colour key on the pixels (`trace2.py`) because the eye put the portrait lip in the
wrong place. The `uk_piemash` and `uk_chippy` portraits were measured on the files regenerated on 2026-09-21.

**The phone band.** A 390-wide viewport shows x .094 to .906 of a portrait painting. Every portrait patch box,
portrait sprite and portrait touch anchor in this area lies inside it. Two painted fittings sit outside it and carry
nothing in portrait: the pub's street bracket (eye at x .923) and the cockle stall's peg (x .925).

**The room heading.** Measured live on the room's own `.scene-title` box: at 1280 x 720 it covers painting
x .022 to .281, y .094 to .249 of the wide painting; at 390 x 844 it covers the whole width of the portrait from
y .079 to .173. The market's wide S-hook at (.259, .158) is inside the wide rectangle, so the wide market hangs
nothing (see "Sprites"). Every gull, being free to fly, was moved clear of the heading; the fixed fittings were not.

## How to read the matrix

One row per room and orientation. Dominant cue is the room's `PAINTED_SIGNATURES` entry; supporting cues are the
`LONDON_AMBIENCE` patches, the `LONDON_HUNG` sprites, the steam, the fire and the boil ellipse. Visibility is the
share of the frame that visibly changes in two seconds (`|ΔR|+|ΔG|+|ΔB| > 24`, the `room-motion.py` metric) over
six composite pairs per cell at frame offsets 60, 100, 140, 180, 220 and 260; the median of six, then the weakest
and strongest. Wide at 1280 x 720, portrait at 390 x 844.

### The public house, `uk_pub`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The coal grate in the settle corner, the part-carved sirloin with a wisp over it, the open copper of gravy, the J-nail under the bar beam, the wrought-iron sign bracket over the open door onto the wet street | The same joint and copper, the grate at the painting's left edge, the lit gas globe on the bar back, the beam nail |
| Boundary | Signature `light` [.884, .378, .956, .504]; steam at the joint (.240, .592) 240 rate 10 and the copper (.105, .748) 200 rate 9; hung `uk-pub-sign` fx .697 fy .092 fw .046 and `uk-hop-bine` fx .499 fy .064 fw .055. No fire ellipse | Signature [.094, .204, .126, .243]; steam (.520, .505) 170 and (.220, .640) 150; `light` on the globe [.176, .036, .240, .064]; hung `uk-hop-bine` fx .523 fy .0375 fw .110 |
| Anchor | The glow sits on the flames inside the grate and stops above the drinker's cap. The sign pivots on the bracket's scrolled eye at (.720, .092); the bine on the J-nail's curve at (.5265, .064) | The grate runs from the left edge to x .122, so the phone keeps its right-hand edge only; the globe is the lamp a phone actually sees |
| Forbidden overlap | The carver's hands and knife, the barmaid at the engine, the drinkers, the pickled onions and cheese | The carver's face, the batter tin, the drinker's cap under the grate |
| Dominant cue | The fire the room is lit by. **There is no pour in this room**: every glass is filled and either standing or held | The same |
| Supporting cues | Two plumes and two hung sprites | Two plumes, the gas globe, the bine. **No pub sign**: the bracket's eye is at x .923 |
| Visibility | 4.17 per cent (3.92 to 4.29) | 14.17 per cent (12.08 to 14.47) |
| Browser status | Watched at 1280 x 720. The sign hangs in front of the gas standard down the street and touches the door jamb's near edge when it swings; that is where a pub sign hangs, and it reads as outside | Watched at 390 x 844. The bine's lower half sits under the heading's text line; its cut stem and upper cones show to the right of the title |

### The tea room, `uk_tearoom`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | Tea falling from the pot's spout through the strainer into the cup, the plate-glass window onto a wet street with an omnibus, the brass ceiling chain ending in an empty ring | The same pour recomposed, the same window at the right, the same chain |
| Boundary | Signature `stream-glint` [.276, .572, .304, .681]; steam at the cup being filled (.295, .648) 250 rate 10, the cup on the right-hand table (.833, .545) 170, the reader's cup (.045, .500) 130; `rain` [.780, .018, .982, .330]; hung `uk-hanging-lamp` fx .549 fy .086 fw .065 | Signature [.350, .566, .392, .666]; steam (.385, .655) 200, (.765, .660) 160, (.640, .555) 120; `rain` [.720, .035, .902, .300]; lamp fx .5045 fy .046 fw .105 |
| Anchor | Lip (.2813, .574), through (.2907, .620) and (.2941, .650), landing where the thread meets the strainer over the cup at (.2971, .678). The lamp's own ring meets the painted ring at (.5815, .092) | Lip (.3562, .5677), through (.3721, .6097) and (.3814, .6266), the tea in the cup at (.3840, .6639); ring at (.557, .050) |
| Forbidden overlap | The waitress's hands and the pot (held, so dry), the sandwiches, scones and cut cake | The same, and the woman in the hat |
| Dominant cue | The tea through the strainer | The same, on the portrait's own path |
| Supporting cues | Three cups steaming, rain on the glass, the lamp | The same four |
| Visibility | 6.00 per cent (5.39 to 6.66) | 19.97 per cent (18.20 to 21.73) |
| Browser status | Watched. First capture 2.44 per cent with two small plumes and a narrow rain box; now three plumes, the full sash and a larger, freer lamp | Watched |

### The market, `uk_market`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | First light down the aisle under iron and glass, the lit gas lamps, the haze with the locomotive's smoke off the viaduct, the empty S-hook on the stall rail | The same aisle, lamps and haze, the empty S-hook on the post at the right |
| Boundary | Signature `sunray` [.520, 0, .920, .600]; `light` [.766, .072, .822, .136] and [.524, .110, .578, .172]; `mist` [.530, .075, .835, .300] alpha .58. No steam, no fire, **no sprite** | Signature [.240, 0, .880, .460]; `light` [.676, .064, .744, .130]; `mist` [.215, .095, .655, .310]; hung `uk-game-brace` fx .7955 fy .092 fw .085 |
| Anchor | The haze stays in the far aisle above the stalls. The wide S-hook is at (.259, .158), inside the heading's rectangle | The brace hangs from the hook's belly at (.838, .092) on plain timber, right edge .8805 |
| Forbidden overlap | The cheesemonger's hands and wire, the woman's basket, the porter | The same |
| Dominant cue | The daylight down the aisle. Nothing in this room is hot | The same |
| Supporting cues | Two lamps and the haze | One lamp, the haze and the brace |
| Visibility | 3.22 per cent (1.34 to 4.07) | 7.46 per cent (2.58 to 8.15) |
| Browser status | Watched. The weak samples are the `sunray` stall (its drift passes through zero twice every 22.4 s); the lamps and the haze keep moving through it | Watched |

### The pie and mash shop, `uk_piemash`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | Green liquor off the ladle onto the pie and mash, the copper of liquor, the stewed and the jellied eel trays, the glazed door onto the wet dock street, the hanging gas globe, the empty brass counter hook | The same pour recomposed, both trays, the window onto the docks, the globe, the hook on the right-hand panel |
| Boundary | Signature `stream-glint` [.238, .504, .258, .614]; steam at the copper (.330, .505), the plate (.235, .610), the tray of pies (.415, .435), the diner's plate (.885, .635); boil (.330, .515) rx 130; `rain` [.612, .035, .643, .240]; `light` [.416, .092, .454, .138] | Signature [.448, .584, .478, .672]; steam at the stewed tray (.545, .450), the plate (.380, .650), the pies (.680, .375); boil (.115, .560); `rain` [.735, .045, .900, .245]; `light` [.445, .026, .532, .074] |
| Anchor | Traced with a colour key: the lip (.2478, .5055), the thread almost straight at x .246, landing in the liquor pooled on the pie at (.2460, .6120) | Traced the same way: the thread forms at (.459, .586) and runs at x .464 to the mash at (.4655, .670) |
| Forbidden overlap | The pieman's hands, the men eating | The same |
| Dominant cue | The liquor over the pie | The same |
| Supporting cues | Four plumes and a boil; **the jellied tray is cold and carries nothing**; rain on the door glass; the globe | Three plumes and a boil, rain, the globe |
| Visibility | 5.06 per cent (4.32 to 5.40) | 17.02 per cent (14.53 to 18.53) |
| Browser status | Watched. The brass counter hook stays empty, by the contract | Watched |

### The fried fish shop, `uk_chippy`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The basket lifted and shaken with fat in threads back to the pan, both open pans, the range's firebox, the draining rack, rain on the window, the empty iron hook | The same, recomposed on the regenerated portrait |
| Boundary | Signature `stream-glint` [.142, .551, .222, .641], four threads; steam at both pans (.155, .612) and (.375, .672) and the rack (.230, .775); fire (.045, .360) rx 62; boil (.375, .680); `rain` [.532, .030, .628, .215] | Signature [.575, .468, .815, .580], five threads; steam (.320, .560), (.660, .590), (.330, .700); fire (.790, .268); boil (.660, .600); `rain` [.105, .022, .430, .190] |
| Anchor | Threads leave the basket at y .553 and reach the fat at y .641, x .148 to .216 | Leave at y .470, reach the fat at y .575, x .585 to .800 |
| Forbidden overlap | The frier's arms, the girl folding paper, the queue | The frier, the lad at the chipper |
| Dominant cue | Fat off the basket into the pan | The same |
| Supporting cues | Three plumes, the firebox, rain on the glass | The same |
| Visibility | 5.06 per cent (4.13 to 5.87) | 20.67 per cent (19.25 to 21.96) |
| Browser status | Watched. The raw chips and the crate of potatoes stay dry | Watched |

### The porters' breakfast, `uk_breakfast`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The boiler tap filling a mug standing on the board, the griddle of bacon, the naphtha flare, the night sky over the market roof, the empty canopy hook | The same tap filling a mug **held in a hand**, the griddle, the flare, the sky over the docks |
| Boundary | Signature `stream-glint` [.384, .560, .398, .600]; steam at the griddle (.235, .665) and the boiler (.330, .330); `light` [.538, .010, .594, .072]; hung `uk-gull` fx .425 fy .020 fw .080 | Signature [.836, .426, .852, .454]; steam (.500, .680), (.845, .330); `light` [.104, .046, .194, .128]; gull fx .340 fy .178 fw .140 |
| Anchor | Nozzle (.3889, .5616) to the mug's mouth (.3916, .5979) | Nozzle (.8452, .4276) to the tea at the held mug's rim (.8426, .4522), as the Stage B note instructed |
| Forbidden overlap | The stallholder's tongs, the porters' faces and mugs | The same |
| Dominant cue | The tap's pour | The same |
| Supporting cues | Two plumes, the flare, the gull. No fire ellipse: the loops are full and the flare is the larger cue | The same; the coals under the portrait griddle are pictured and carry no ellipse for that reason |
| Visibility | 4.05 per cent (3.50 to 4.67) | 15.86 per cent (13.47 to 19.27) |
| Browser status | Watched. The gull flies clear of the flare | Watched. The gull was moved from y .090 to .178, below the heading |

### The seamen's kitchen, `uk_lascar`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | Ground spice sliding off the tilted slab into the open curry pot, the rice pan with its lid off, the roti griddle, the open range, the empty chain and S-hook on lime wash | The same slab and pot, the rice pan at the right, the fire, the chain and hook |
| Boundary | Signature `stream-glint` [.348, .475, .376, .601]; steam at the curry (.350, .545), the rice (.185, .545), the roti (.130, .760); fire (.375, .700) rx 95; boil (.350, .560); hung `uk-hanging-lamp` fx .6055 fy .200 fw .045 | Signature [.566, .509, .606, .602]; steam (.545, .575), (.860, .630); fire (.560, .715) rx 130; boil (.560, .590); lamp fx .7325 fy .108 fw .085 |
| Anchor | Slab lip (.3558, .4766) through (.3606, .5248), (.3648, .5682) to the curry at (.3677, .5995). Hook belly (.628, .202) | Lip (.5747, .5109) through (.5839, .5492), (.5931, .5817) to (.596, .600). Hook (.775, .110) |
| Forbidden overlap | The cook's hands, the men on the bench, the fish, the spice sacks | The same |
| Dominant cue | The spice fall | The same |
| Supporting cues | Three plumes, the range fire, the lamp | Two plumes, the fire, the lamp |
| Visibility | 5.84 per cent (5.18 to 6.52) | 12.63 per cent (11.81 to 13.13) |
| Browser status | Watched | Watched |

### The hop-pickers' cookhouse, `uk_hopkitchen`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The ladle poured back into the cauldron on its chain, the kettle, the open wood fire, the empty wire line between two poles against grey sky | The same pour, fire and line |
| Boundary | Signature `stream-glint` [.290, .583, .306, .642]; steam at the cauldron (.330, .618) 220 and the kettle (.175, .740); fire (.340, .900) rx 110; boil (.330, .630); hung `uk-hop-bine` fx .5675 fy .040 fw .065 | Signature [.506, .505, .528, .601]; steam (.500, .592) 220; fire (.530, .745) rx 120; boil (.500, .605); bine fx .335 fy .065 fw .130 |
| Anchor | Ladle rim (.2964, .5848) through (.2979, .6155) to the stew (.2986, .6410). The line crosses x .600 at y .040 | Rim (.5123, .5074) through (.5192, .5380), (.5211, .5832) to (.5219, .5997). The line crosses x .400 at y .065 |
| Forbidden overlap | The cook's arm, the children's bowls (held, dry), the bin of green cones | The same |
| Dominant cue | The ladle's pour | The same |
| Supporting cues | Two plumes, the fire, the bine | One plume, the fire, the bine |
| Visibility | 3.25 per cent (3.15 to 4.13) | 11.36 per cent (9.45 to 12.27) |
| Browser status | Watched | Watched |

### The dale dairy, `uk_dairy` (the cold room)

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | Whey running from the press spout into the pail, with its ring painted on the surface; the open door onto the pasture and the scar; the tree by the door; the empty wooden peg | The same press and pail, the door on the left, the curd rack dripping whey off its slats, the peg |
| Boundary | Signature `drip` [.552, .628, .570, .740], splash; `sunray` [.480, .060, .930, .960]; `mist` [.660, .120, .878, .420] alpha .52; `leaves` [.655, .100, .818, .345], green, 8 at size 2.0. **No steam, no fire, no boil, anywhere** | Signature [.496, .581, .516, .661], splash; `sunray` [.096, 0, .440, .520]; `mist` [.098, .140, .352, .400]; `drip` off the rack [.640, .750, .880, .815], four threads, no splash |
| Anchor | Spout (.5595, .6300) to the whey in the pail (.5603, .7370) | Spout (.5033, .5832) to the pail (.5063, .6590) |
| Forbidden overlap | The dairymaids, the girl with the pail, the sheep | The same |
| Dominant cue | Whey into the pail | The same |
| Supporting cues | The door's beam across the flags, the morning haze on the pasture, the tree | The beam, the haze, the rack's whey |
| Visibility | 3.31 per cent (0.95 to 5.19) | 4.85 per cent (2.26 to 6.13) |
| Browser status | Watched. First capture 1.28 per cent. Three changes: gulls gave way to the pasture's haze (two silhouettes do not count in a changed-pixel metric); the beam moved off the sunlit doorway, where it was light on light, onto the dim stone it actually crosses; and the tree's leaves, first switched to the default cut-outs for size, came back as green procedural leaves after the live look showed the cut-outs are red autumn leaves over a summer pasture | Watched |

### The Cornish bakehouse, `uk_pasty`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The granite oven's open mouth with the peel going in, the baked pasties on the cloth, the doorway onto the cove and the engine house, the empty iron hook | The same oven at the right edge, the broken pasty, the doorway at the left |
| Boundary | Signature `light` [.870, .225, .960, .400]; steam at the pasties (.760, .615) 230 and the tray in the oven (.905, .355); fire (.915, .320) rx 70; `birds` [.050, .028, .200, .090] | Signature [.845, .240, .903, .325]; steam (.500, .690), (.885, .315); fire (.880, .285); `birds` [.170, .176, .320, .232] |
| Anchor | The glow sits inside the arch | The arch runs past x .906; the box stops at .903 |
| Forbidden overlap | The crimping hands, the children, the baker | The same |
| Dominant cue | The oven mouth | The same |
| Supporting cues | Two plumes, the fire, gulls in the doorway's sky above the heading | The same, the gulls below the heading |
| Visibility | 4.86 per cent (4.17 to 5.24) | 12.38 per cent (10.99 to 13.25) |
| Browser status | Watched. The raw pasties, swede, potato and beef stay dry | Watched |

### The cockle sands, `uk_cockles`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | Wet sand falling through the shaken riddle to the heap, the copper boiling on the shore over driftwood, the bakestone, the clean sky, the empty peg on the stall upright | The same riddle close up, the copper on its tripod, the sky over the estuary, the peg at x .925 |
| Boundary | Signature `stream-glint` [.762, .532, .824, .800], four falls; steam at the copper (.045, .390) 230 and the bakestone (.500, .780); fire (.035, .560) rx 85; boil (.045, .400); hung `uk-gull` fx .592 fy .015 fw .095 | Signature [.345, .600, .865, .745], six falls; steam (.125, .335), (.560, .905); fire (.115, .400); boil (.125, .345); gull fx .765 fy .180 fw .120 |
| Anchor | From the riddle's underside at y .532 to the heap at y .800 | From y .600 to y .745 |
| Forbidden overlap | The women's hands and faces, the donkeys, the boy | The woman's face and scarf |
| Dominant cue | The sand through the riddle | The same |
| Supporting cues | Two plumes, the fire, the gull. **The cockles, the sand and the sacks are cold** | The same |
| Visibility | 3.37 per cent (3.16 to 3.56) | 10.66 per cent (9.51 to 13.21) |
| Browser status | Watched. First capture 2.65; the plumes, fire and gull were enlarged | Watched. The gull was moved from y .030 to .180, below the heading and right of the woman's scarf |

### The smokehouse, `uk_smokehouse`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The hardwood fire in the sunk barrel with tied pairs over it, the hot-smoked fish on the table, the bare upper cross-bar of the right-hand frame, the grey sky | The tied pair lowered over the pit, the fire, the table of fish, the cross-bar at the top |
| Boundary | Signature `embers` [.380, .770, .550, .860]; steam at the pit (.440, .700) and the table (.115, .625); hung `uk-smoke-speet` fx .780 fy .100 fw .055 and `uk-gull` fx .600 fy .015 fw .075. No fire ellipse | Signature [.440, .645, .760, .715]; steam (.550, .640), (.330, .830); speet fx .730 fy .070 fw .100; gull fx .725 fy .176 fw .115 |
| Anchor | Sparks rise inside the pictured flames. The speet stops above the painted rail of fish at y .18 | The speet hangs from the bar at (.780, .070) |
| Forbidden overlap | The curer's hands, the women, the kippers and Findon (cold-smoked, dry) | The same |
| Dominant cue | Sparks off the pit | The same |
| Supporting cues | Two plumes, two sprites. The pit's own fire is the signature, so it takes no ellipse; with two sprites an ellipse would be a fifth loop | The same |
| Visibility | 4.03 per cent (3.52 to 4.43) | 19.51 per cent (16.32 to 22.47) |
| Browser status | Watched | Watched. The speet reads to the right of the heading text; the gull was moved below the heading |

### The distillery, `uk_distillery`

| Field | Wide | Portrait |
| --- | --- | --- |
| Pictured source | The middle cut running in the spirit safe, the peat fire under the kiln arch, the open washback, the shaft from the high window across the green malt, the empty wall hook | The same safe with a copper spout, the peat fire at the left, the shaft from the window at the right, the hook at x .94 |
| Boundary | Signature `stream-glint` [.770, .349, .786, .387]; steam at the washback (.430, .490) and the kiln mouth (.040, .400); fire (.035, .460) rx 70; `sunray` [.100, 0, .400, .540] | Signature [.834, .478, .852, .562]; steam at the kiln (.115, .285); fire (.105, .400) rx 62 ry 105; `sunray` [.545, 0, .900, .480] |
| Anchor | Funnel (.7773, .3505) to the spirit in the bowl (.7781, .3855) | Spout (.8416, .4803) through (.8429, .5155), (.8443, .5440) to the spirit (.8437, .5604) |
| Forbidden overlap | The maltman, the stillman at the safe, the oatcakes and dram | The same |
| Dominant cue | The spirit in the safe | The same |
| Supporting cues | Two plumes, the peat fire, the window's shaft | One plume, the fire, the shaft |
| Visibility | 5.49 per cent (3.11 to 6.71) | 7.47 per cent (5.79 to 10.82) |
| Browser status | Watched | Watched. First capture 1.75 per cent with no plume and a small ellipse; the kiln's plume and an ellipse the size of the painted fire were added |

## Loop counts

`room-loops.mjs` output for the area (`LOOPS_SHOW='^uk_'`), after the last change:

| Room | Wide | Portrait |
| --- | --- | --- |
| `uk_pub` | 4: light, steam, 2 sprites | 4: light, steam, globe, sprite |
| `uk_tearoom` | 4: glint, steam, rain, sprite | 4: the same |
| `uk_market` | 4: sunray, light, mist, light | 4: sunray, light, mist, sprite |
| `uk_piemash` | 4: glint, steam, rain, light | 4: the same |
| `uk_chippy` | 4: glint, steam, fire, rain | 4: the same |
| `uk_breakfast` | 4: glint, steam, light, gull | 4: the same |
| `uk_lascar` | 4: glint, steam, fire, sprite | 4: the same |
| `uk_hopkitchen` | 4: glint, steam, fire, sprite | 4: the same |
| `uk_dairy` | 4: drip, sunray, mist, leaves | 4: drip, sunray, mist, drip |
| `uk_pasty` | 4: light, steam, fire, birds | 4: the same |
| `uk_cockles` | 4: glint, steam, fire, gull | 4: the same |
| `uk_smokehouse` | 4: embers, steam, 2 sprites | 4: the same |
| `uk_distillery` | 4: glint, steam, fire, sunray | 4: the same |

## Hot and cold

Every pictured hot vessel steams, and nothing held in a hand does. Measured and left dry: the whole of `uk_dairy`
(no heat of any kind, its liquids drip); the market's cheese, butter, eggs, apples and vegetables; the jellied eel
tray beside the steaming stewed one; the raw chips and potatoes; the tea room's pot (held), bread, scones and cake;
the porters' mugs (held); the lascar kitchen's whole spices, fish and chillies; the hop bin and the loaf; the raw
pasties and their filling; the cockles, the riddle's sand, the sacks and the laverbread; the kippers and the Findon;
the green malt, the oatcakes and the dram.

## Breeze masks

Britain ships no `breeze` crop. Every hanging object arrived as a keyed sprite and every painting has its fitting
empty, so `scripts/audit/breeze-masks.py` has nothing new to render for this area.

## Sprites

Six delivered, six used.

| Sprite | Rooms and orientations | Fitting |
| --- | --- | --- |
| `uk-pub-sign` | `uk_pub` wide | The wrought-iron street bracket's eye |
| `uk-hop-bine` | `uk_pub` wide and portrait, `uk_hopkitchen` wide and portrait | The J-nail under the bar beam; the wire line between the poles |
| `uk-game-brace` | `uk_market` portrait | The S-hook on the stall post |
| `uk-hanging-lamp` | `uk_tearoom` and `uk_lascar`, wide and portrait | The brass ceiling ring; the chain's S-hook over the range |
| `uk-smoke-speet` | `uk_smokehouse` wide and portrait | The bare upper cross-bar of the right-hand frame |
| `uk-gull` | `uk_breakfast`, `uk_cockles`, `uk_smokehouse`, wide and portrait | None: it flies |

Two contracted orientations hang nothing: `uk_pub` portrait (bracket eye at x .923, outside the phone band) and
`uk_market` wide (S-hook at (.259, .158), inside the room heading's rectangle at desktop size, where a brace is
completely hidden; the wide painting spends the loop on a second gas lamp). Fittings that stay empty by the
contract: the pie shop's brass counter hook, the chippy's iron hook, the coffee stall's canopy hook, the dairy's
peg, the bakehouse's iron hook, the cockle stall's peg and the distillery's wall hook.

**Sprites under the portrait heading.** The portrait heading runs the whole phone width from y .079 to .173. Five
painted fittings sit at portrait y .04 to .11 — the pub's beam nail, the tea room's ring, the hop line, the market
post and the smokehouse bar — so those sprites start at or above the heading and hang down through it; each reads to
the right of or below the title text in the live look, and moving them would detach them from their hooks. The
three gulls, which hang from nothing, were moved below the heading.

## Measured motion

| Room | Wide at 1280 x 720 | Portrait at 390 x 844 | Floor |
| --- | --- | --- | --- |
| `uk_pub` | 4.17 (3.92 to 4.29) | 14.17 (12.08 to 14.47) | 3% |
| `uk_tearoom` | 6.00 (5.39 to 6.66) | 19.97 (18.20 to 21.73) | 3% |
| `uk_market` | 3.22 (1.34 to 4.07) | 7.46 (2.58 to 8.15) | 3% (mist) |
| `uk_piemash` | 5.06 (4.32 to 5.40) | 17.02 (14.53 to 18.53) | 3% |
| `uk_chippy` | 5.06 (4.13 to 5.87) | 20.67 (19.25 to 21.96) | 3% |
| `uk_breakfast` | 4.05 (3.50 to 4.67) | 15.86 (13.47 to 19.27) | 3% |
| `uk_lascar` | 5.84 (5.18 to 6.52) | 12.63 (11.81 to 13.13) | 3% |
| `uk_hopkitchen` | 3.25 (3.15 to 4.13) | 11.36 (9.45 to 12.27) | 3% |
| `uk_dairy` | 3.31 (0.95 to 5.19) | 4.85 (2.26 to 6.13) | 3% (mist) |
| `uk_pasty` | 4.86 (4.17 to 5.24) | 12.38 (10.99 to 13.25) | 3% |
| `uk_cockles` | 3.37 (3.16 to 3.56) | 10.66 (9.51 to 13.21) | 3% |
| `uk_smokehouse` | 4.03 (3.52 to 4.43) | 19.51 (16.32 to 22.47) | 3% |
| `uk_distillery` | 5.49 (3.11 to 6.71) | 7.47 (5.79 to 10.82) | 3% |

Every cell clears its floor on the median. Five cells did not on the first capture and were strengthened as each
room's row says: `uk_tearoom` wide (2.44), `uk_dairy` wide (1.28), `uk_cockles` wide (2.65), `uk_distillery`
portrait (1.75), and `uk_market` wide was lifted from a thin 3.08. Three cells keep a weak single sample under the
floor while their medians clear it — `uk_market` both orientations and `uk_dairy` both — and all three are the
`sunray` stall `docs/spain-rooms.md` records: the beam's drift passes through zero twice every 22.4 s. Both rooms
carry haze and a lamp or a drip beside the beam, so neither stops moving on screen.

Method. The dev server through the preview tool, `scripts/tests/rooms.html`, with each room built from
`LONDON_SCENES` in a harness injected into the page, sized to 1280 x 720 or 390 x 844, waited on until the right
orientation's painting had loaded, and ticked by hand at 1/60 s; composites are `LivingScene.snapshot()`. The same
caveat as Thailand's applies to portrait: the snapshot draws the whole stage squashed into the element, so portrait
percentages compare with each other and with the other areas' portrait figures, not with a share of a phone screen.
The first portrait pass read 2 to 4 per cent too low on some rooms because the capture began before the portrait
painting had replaced the wide one; the harness now waits for the portrait file, and every portrait figure above
comes from that version. The Italy and Stand makers were editing files on the same server throughout, so the page
reloaded every few seconds; Vite's reload messages were muted in the measuring tab and results were kept in
`sessionStorage` between calls.

## Every cue draws at phone width

The room's own effect canvas at 390 x 844 after 200 frames, all thirteen rooms: every room draws lit pixels (90,848
in `uk_dairy`, the lowest, to 389,239 in `uk_chippy`), every portrait sprite's rectangle lies inside 0 to 390 CSS
px, and every portrait fire ellipse has a moving opacity. The pub's, the cockles' and the distillery's portrait
fire and firelight start at the painting's left edge, so part of their glow is off-screen; each is anchored inside
the band. The three moved gulls were checked arithmetically after the move (x .340 to .480, .765 to .885, .725 to
.840), not re-read on the canvas.

## Verification

- `npm run typecheck` is clean.
- `room-loops.mjs` and `scene-ambience.mjs` pass with London and Italy both registered (116 rooms; 115
  signatures — 89 before, 102 with Britain, 115 with Italy's thirteen, which the Italy Room maker added).
- `npm test`: 26 of 27 harnesses pass. `italy-world.mjs` fails; it belongs to the Italy build still in progress in
  untracked files, not to this area. Because the whole tree does not pass, **this commit carries only the Britain
  room files** — `scenes-london.ts`, `london-ambience.ts` and this document. The thirteen `uk_` signatures in
  `scene-ambience.ts`, the count literal in `scene-ambience.mjs`, and the London registrations in `room-loops.mjs`,
  `room-audit.html` and `rooms.html` are written and passing on disk but are left uncommitted, because those four
  files also carry the Italy Room maker's uncommitted lines. They go in with the next commit of the shared files.
- Contact sheet of all thirteen rooms, wide and portrait, live composites at 4 s:
  `scratchpad/london-rooms-live.png`. Pour overlay sheet, every signature box outlined on the live composite at 4 s
  and 6 s in both orientations: `scratchpad/uk-pours.jpg`.

## Not verified

- **Nothing was seen through the world route**: `graph.ts` does not register the Britain rooms until Stage D, so
  every room was opened from `LONDON_SCENES`. The arrival, the card chain and "The story" were not exercised.
- **The touches were not clicked.** Every anchor was read on the painting in both orientations, but no touch
  response was watched, and the anchors were not drawn on an overlay of their own.
- **Reduced motion was not checked in the browser** for these rooms; no Britain cue is outside the engine's path.
- The "watched for twenty seconds" standard was met by stepped captures at 4 s and 6 s and the motion pairs, not by
  real-time watching in a displayed pane; one room (`uk_smokehouse` portrait) was looked at in the displayed pane
  with its UI.
- `scripts/audit/room-motion.py` was not run: its metric was run in the page, and the pairs were not written to
  `.data/shots`.
- Not looked at on a large screen or a physical phone.

## Left for the lead

1. Record the twenty-six figures above in `docs/quality-baseline.md`.
2. Decide whether the market's wide S-hook, the pub's portrait bracket and the five portrait fittings under the
   heading are worth a regeneration, or stay as they are here.
3. `scripts/tests/room-loops.mjs`, `scene-ambience.mjs`, `room-audit.html` and `rooms.html` now carry both the
   London and the Italy registrations on the same lines.
