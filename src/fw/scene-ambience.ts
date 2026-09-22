/** Continuous, painting-aligned motion. Coordinates belong to each supplied composition. */
export type PaintingRect = [left: number, top: number, right: number, bottom: number];
export type AmbientPatch = {
  kind: 'leaves' | 'birds' | 'stream-glint' | 'waterfall-glint' | 'drip' | 'dust' | 'rain' | 'mist' | 'light' | 'sunray' | 'breeze' | 'snow' | 'embers';
  wide?: PaintingRect;
  phone?: PaintingRect;
  color?: string;
  leaf?: 'olive' | 'yellow' | 'blossom';
  /** Peak opacity of a mist bank (default .40). Raise it where the painting behind is already hazy. */
  alpha?: number;
  /** Size multiplier for birds (default 1). Use up to 1.6 for birds in a large open sky near the viewer. */
  scale?: number;
  /** Falling leaves per patch (default 4, at most 8) and their size multiplier (default 1). */
  count?: number;
  size?: number;
  angles?: [wide: number, phone: number];
  /** Orientation-specific paths traced inside the patch rectangle, in local 0..1 coordinates.
   * `drip` uses the same traced path: the first point is the lip the liquid leaves, the last is the surface it
   * lands on, and the drops fall between them. */
  paths?: [wide: Point[][] | undefined, phone: Point[][] | undefined];
  /** Maximum top-pivot rotation for a tightly cropped source layer. */
  sway?: [wide: number, phone: number];
  /** Painted subject isolated by a source-layer breeze. Red hanging details use the same conservative colour key. */
  source?: 'chilli' | 'ristra' | 'red-tassel' | 'garlic' | 'bell' | 'grape' | 'leaves';
  /** A restrained ambient accent can be reserved for touch. */
  clickOnly?: boolean;
  /** Per orientation, whether a `drip` opens a ring where it lands. False where the painting does not show the
   * surface the liquid reaches — a drip that passes behind a rim must not splash on wood. */
  splash?: [wide: boolean, phone: boolean];
  period?: number;
};
type Point = [number, number];
// 53 signatures + the existing hotpot boil. Effects may move an isolated painted detail or add a
// natural cue anchored to visible scenery; they never draw replacement food, people or processes.
// A `breeze` isolates a painted subject by colour and repairs the wall behind it, so it belongs only where the
// subject is one clean object on a plain, neutral wall. Spain dropped all eleven of its crops on 2026-09-16 and
// China's chilli crops followed on 2026-09-17: see docs/spain-rooms.md and docs/building-a-world.md.
export const PAINTED_SIGNATURES: Record<string, AmbientPatch> = {
  noodle_shop: {kind:'sunray',wide:[.38,0,.93,.72],phone:[.42,.02,.94,.62],angles:[-.42,.36]},
  teahouse: {kind:'leaves',wide:[.30,.12,.72,.40],phone:[.28,.19,.80,.38],leaf:'yellow',color:'#c9b23a',count:8,size:1.6},   // the willow and osmanthus canopy over the open view; the painted tassel hangs against that foliage, which no repair can rebuild, so it stays still
  market: {kind:'light',wide:[.827,.038,.873,.112],phone:[.198,.175,.332,.256]},   // the lit lantern over the lane; the painted chilli strings run off the frame edge and tangle with garlic, so they stay still
  home_kitchen: {kind:'light',wide:[.095,.560,.215,.730],phone:[.265,.543,.348,.600],color:'#f3a34b'},   // the open wood fire under the wok; the painted chillies hang in a curtain no crop can isolate, so they stay still
  tower: {kind:'birds',wide:[.60,.02,.95,.24],phone:[.55,.08,.94,.25],period:8,scale:1.5},   // larger and more frequent since 2026-09-17, to carry the room after its tassel and bell crops came out
  bao_shop: {kind:'dust',wide:[.08,.52,.32,.67],phone:[.08,.55,.45,.68]},
  stone_bridge: {kind:'mist',wide:[.35,.40,.82,.66],phone:[.35,.37,.78,.57],alpha:.50},
  crab_pond: {kind:'leaves',wide:[.45,.02,.88,.55],phone:[.25,.02,.78,.48],color:'#b96d42'},
  jiangnan_home: {kind:'birds',wide:[.40,.02,.72,.20],phone:[.38,.05,.70,.22],period:13},
  lotus_garden: {kind:'sunray',wide:[.06,0,.66,.68],phone:[0,.05,.58,.65],angles:[-.45,.38],sway:[.04,.04]},
  rice_wine: {kind:'sunray',wide:[.35,0,.88,.72],phone:[.28,0,.82,.65],angles:[-.42,.38]},
  river_market: {kind:'sunray',wide:[.40,0,.92,.66],phone:[.35,0,.95,.60],angles:[-.40,.36],sway:[.04,.04]},
  riverside_restaurant: {kind:'birds',wide:[.48,.04,.84,.22],phone:[.42,.09,.77,.27],period:13},
  tea_hill: {kind:'birds',wide:[.48,.02,.82,.18],phone:[.35,.06,.75,.21],period:13},
  kebab_grill: {kind:'light',wide:[.30,.63,.78,.78],phone:[.12,.59,.45,.65],color:'#f3a34b'},
  naan_bakery: {kind:'sunray',wide:[.50,0,.98,.70],phone:[.42,0,.96,.66],angles:[-.42,.36]},
  polo_kitchen: {kind:'light',wide:[.20,.53,.54,.64],phone:[.08,.47,.64,.54],color:'#e6b452'},
  laghman_shop: {kind:'dust',wide:[.25,.59,.51,.65],phone:[.18,.51,.53,.56]},
  oasis_bazaar: {kind:'sunray',wide:[.15,0,.75,.75],phone:[.12,0,.72,.65],angles:[-.36,.34],sway:[.05,.05]},
  grape_courtyard: {kind:'sunray',wide:[.28,0,.72,.58],phone:[.18,0,.62,.55],angles:[-.52,.42],sway:[.018,.025]},
  oasis_field: {kind:'sunray',wide:[.43,0,.96,.62],phone:[.40,0,.98,.52],angles:[-.45,.38],sway:[.04,.04]},
  chaikhana: {kind:'sunray',wide:[.10,0,.80,.70],phone:[.10,0,.85,.65],angles:[-.42,.36]},
  xj_home: {kind:'dust',wide:[.18,.60,.34,.65],phone:[.21,.44,.39,.47]},
  caravan_stop: {kind:'leaves',wide:[.70,.22,.93,.43],phone:[.39,0,.68,.18],leaf:'olive',color:'#6f8f4e'},
  tianshan: {kind:'mist',wide:[.50,.15,.85,.55],phone:[.45,.20,.90,.60],alpha:.55},
  evening_feast: {kind:'light',wide:[.11,.10,.18,.20],phone:[.02,.04,.09,.14],color:'#ffc47a'},
  skewer_courtyard: {kind:'leaves',wide:[.38,0,.88,.34],phone:[.45,0,.98,.30],color:'#b64b35'},
  mantou_kitchen: {kind:'dust',wide:[.10,.42,.36,.66],phone:[.26,.44,.72,.59]},
  dumpling_house: {kind:'dust',wide:[.18,.51,.48,.69],phone:[.20,.49,.55,.65]},
  winter_table: {kind:'snow',wide:[.66,.03,.86,.18],phone:[.62,.14,.88,.29],color:'#fff9e9'},
  courtyard_kitchen: {kind:'snow',wide:[.61,.015,.73,.30],phone:[.60,.02,.84,.20],color:'#fff9e9'},
  hutong: {kind:'leaves',wide:[.45,0,.92,.64],phone:[.44,0,.93,.62],color:'#a76543'},
  bing_stall: {kind:'dust',wide:[.08,.40,.34,.57],phone:[.05,.43,.49,.58]},
  north_market: {kind:'sunray',wide:[.38,0,.88,.72],phone:[.35,0,.88,.68],angles:[-.42,.38],sway:[.04,.04]},
  noodle_workshop: {kind:'leaves',wide:[.64,0,.98,.31],phone:[.42,.06,.82,.27],leaf:'yellow',color:'#cc7f2f',count:8,size:1.5},   // fuller since 2026-09-17, to carry the room after its garlic crop came out
  roast_duck: {kind:'light',wide:[.27,.18,.51,.48],phone:[.77,.32,1,.54],color:'#f2a34b'},
  vinegar_workshop: {kind:'sunray',wide:[.55,.08,.92,.72],phone:[.42,.04,.88,.54],angles:[-.42,.38]},
  wheat_harvest: {kind:'sunray',wide:[.25,0,.90,.75],phone:[.10,0,.90,.68],angles:[-.45,.38],sway:[.04,.04]},
  tr_simit: {kind:'birds',wide:[.75,.02,.96,.20],phone:[.59,.045,.95,.18],period:8,scale:1.5},
  tr_tea: {kind:'birds',wide:[.66,.02,.94,.18],phone:[.66,.04,.98,.20],period:8,scale:1.4},
  // The panes were re-measured on the pixels on 2026-09-17 with the new rain. Wide: the left jamb ends at x .776
  // and the mullion between the sashes runs x .930 to .956, the head rail ends at y .028 and the near drinker's cap
  // reaches y .345, so the centre pane's clear glass is [.795, .045, .925, .325].
  // Phone: the box used to be [.903, .164, .991, .306], on the lower-right sash — and **that sash is off the screen
  // on a phone**. `paintingFrame` fits the portrait painting at 512.2 stage units and a 390-wide viewport shows only
  // 415.9 of them, so the visible slice of this painting is x .094 to .906 and the old box drew nothing at all: the
  // room's signature loop was invisible in portrait. Measured live on 2026-09-17 (zero lit effect pixels right of
  // x .88 on the room's own effect canvas at 390 x 844). The signature moves to the clear column of the lower-LEFT
  // sash, which is inside the slice: its glass runs x .718 to .846 with the transom ending at y .152 and the near
  // drinker's cap starting at y .298, and the potted plant inside the room crosses the pane only left of x .800
  // (no green pixel between x .800 and .846 from y .155 to .300), so [.802, .158, .843, .294] is clean glass.
  tr_coffee: {kind:'rain',wide:[.795,.045,.925,.325],phone:[.802,.158,.843,.294]},
  tr_market: {kind:'breeze',wide:[0,0,.075,.275],phone:[0,0,.05,.18],period:6.4,sway:[.075,.095]},
  tr_fish: {kind:'light',wide:[.40,.72,.50,.88],phone:[.70,.58,.82,.72],color:'#f3a34b'},
  tr_kebab: {kind:'breeze',wide:[.292,.0,.335,.235],phone:[.13,.0,.22,.18],period:6.8,sway:[.052,.072]},
  tr_baklava: {kind:'sunray',wide:[.36,.0,.98,.92],phone:[.36,.0,.99,.90],angles:[.55,.42],sway:[.026,.065]},
  tr_pide: {kind:'breeze',wide:[.655,.0,.706,.155],phone:[.065,.0,.19,.17],period:7.4,sway:[.052,.072]},
  tr_yufka: {kind:'dust',wide:[.19,.60,.36,.75],phone:[.24,.58,.46,.74]},
  tr_dolma: {kind:'breeze',wide:[.412,.0,.458,.235],phone:[.43,.0,.57,.14],period:6.4,sway:[.08,.10]},
  tr_breakfast: {kind:'sunray',wide:[.18,.0,.72,.90],phone:[.08,.0,.77,.82],angles:[-.48,.44],sway:[.04,.04]},
  tr_meze: {kind:'breeze',wide:[.618,.0,.665,.15],phone:[.185,.0,.33,.16],period:6.6,sway:[.085,.10]},
  tr_olive: {kind:'leaves',wide:[.37,.04,.59,.52],phone:[.50,.03,.82,.37],leaf:'olive',color:'#82945e',count:8,size:1.6},
  tr_tea_hill: {kind:'mist',wide:[.28,.12,.78,.40],phone:[.20,.16,.78,.40],alpha:.58},   // the valley haze the painting already shows, strong enough to read
  tr_supper: {kind:'breeze',wide:[.0,.0,.043,.235],phone:[.945,.16,1,.305],period:6.9,sway:[.052,.072]},
  // Spain: one signature per room, measured on each painting. No Spain room uses a breeze crop: a painted string
  // that can hold motion carries the es-pepper-ristra sprite over it instead (see spain-ambience.ts), and one that
  // cannot stays still while its room's signature moves something else the painting already shows.
  es_paella: {kind:'birds',wide:[.40,.045,.78,.115],phone:[.46,.07,.85,.16],period:5.5,scale:1.6},   // gulls over the paddies, beside the painted ones
  es_tapas: {kind:'light',wide:[.556,.090,.610,.182],phone:[.525,.082,.588,.142]},   // the arcade lantern in the doorway, box widened to the lantern glass and its halo
  es_jamon: {kind:'sunray',wide:[.06,0,.60,.72],phone:[.46,0,1,.52],angles:[-.30,.35],sway:[.090,.075]},   // the beam through the glass roof
  es_tortilla: {kind:'light',wide:[.042,.578,.148,.742],phone:[.485,.605,.560,.685],color:'#f3a34b'},   // the open firebox of the range, the strongest cue left now the string swings as a sprite
  es_churros: {kind:'light',wide:[.79,.855,.975,.965],phone:[.41,.555,.56,.635],color:'#f3a34b'},   // the hearth under the fryer
  es_pintxos: {kind:'sunray',wide:[.56,.02,1,.78],phone:[.26,.02,1,.58],angles:[-.30,.30],sway:[.090,.080]},   // the coastal light through the stone doorway
  es_gazpacho: {kind:'leaves',wide:[.02,.02,.42,.22],phone:[.55,.02,.98,.24],leaf:'olive',color:'#5f7f3b',count:8,size:1.6},   // the orange tree canopy over the courtyard, in both compositions
  es_pulpo: {kind:'birds',wide:[.372,0,.532,.056],phone:[.33,.005,.56,.10],period:4.5,scale:1.7},   // the clean grey opening between the arcade piers, above the trees and the hórreo
  es_pa_tomaquet: {kind:'leaves',wide:[.38,.02,.84,.32],phone:[.30,.02,.97,.28],count:8,size:1.4},   // the plane tree canopy
  // Re-measured 2026-09-16 on wide.jpg: the old wide box sat on the wooden lintel above the door, not in the sky.
  // The band below is the open sky inside the doorway, between the fig canopy above and the windmill sails below.
  // Widened to the full clean span on 2026-09-17, because this room's wide painting measured under its floor: the
  // door's inner jambs are x .524 and .727, the fig branch hangs to y .135 above and the near windmill's sails reach
  // y .152, so the two rows (.45 and .67 of the box) fly at y .1423 and .1542 and cross from x .565 to .707, clear
  // of both, over a longer path than before. `scale` and `period` are shared with the phone box, whose portrait
  // measures 8.0 per cent and was not to be touched, so they stay at 1.6 and 5.5 and the wide box alone changed.
  es_manchego: {kind:'birds',wide:[.552,.118,.720,.172],phone:[.19,.03,.45,.095],period:5.5,scale:1.6},   // the sky over the windmill ridge, and the doorway sky in the portrait
  // Re-measured 2026-09-17 on both files, because the owner saw the pale thread moving above the bottle: the phone
  // box started at y .090, which is the green body of the tilted bottle — the lip is at y .112 — so the glint ran
  // over the glass of the bottle itself. Both boxes now start at the lip the cider leaves and stop at the surface of
  // the cider in the glass, and the clip rectangle is those two points, so nothing can glint outside them.
  // Wide: lip (.5156, .042), the thread through (.5191, .136), (.5221, .277), (.5245, .419), surface (.5251, .607).
  // Portrait: lip (.6206, .112), through (.6259, .215), (.6312, .339), (.6376, .463), surface (.6415, .566).
  es_sidreria: {kind:'stream-glint',wide:[.508,.042,.534,.607],phone:[.606,.112,.652,.566],color:'#f6e3a8',
    paths:[[[[.29,0],[.43,.17],[.54,.42],[.63,.67],[.67,1]]],[[[.32,0],[.43,.23],[.55,.50],[.69,.77],[.77,1]]]]},   // the escanciado: the painted cider thread, bottle lip to the cider in the glass, traced on the pixels of each composition
  es_bodega: {kind:'sunray',wide:[.40,0,1,.72],phone:[.28,0,1,.64],angles:[.60,.50],sway:[.09,.085]},   // the shaft from the high shutter
  // Thailand: one signature per room, measured on that room's own wide.jpg and portrait.jpg. No Thailand room uses
  // a breeze crop and none needed one — every painting was generated with an empty hook, pole, rail, line or nail
  // and its hanging object arrived as a separate keyed sprite, so the hanging motion is a `th-*` sprite laid over
  // clean wall, plank, sky or paddy (see thailand-ambience.ts). Three rooms sign with a traced pour, because a
  // pour is what those paintings are of; the rest sign with light, haze, sky, foliage or sparks off a fire the
  // painting already draws. Every box and path is in docs/thailand-rooms.md with the pixels it was read off.
  // The coconut water: the cut lip of the young coconut down to the surface in the cup standing on the thwart.
  // Wide: lip (.4905, .5225), thread through (.493, .550) and (.4955, .600), surface (.4965, .636).
  // Portrait: lip (.512, .518), through (.512, .548) and (.510, .585), surface in the bamboo cup (.508, .612).
  th_khlong: {kind:'stream-glint',wide:[.484,.5225,.504,.637],phone:[.500,.518,.524,.612],color:'#eaf6ff',
    paths:[[[[.325,0],[.45,.24],[.575,.677],[.625,1]]],[[[.50,0],[.50,.32],[.417,.71],[.333,1]]]]},   // the water running out of the cut coconut into the cup
  // The ladle of boat-noodle broth. Wide: the broth leaves the ladle rim at (.5535, .5025) and lands on the
  // noodles at (.549, .582). Portrait: lip (.548, .472), landing on the broth in the bowl at (.542, .5565).
  th_noodleboat: {kind:'stream-glint',wide:[.542,.502,.562,.582],phone:[.534,.472,.558,.557],color:'#f0c477',
    paths:[[[[.575,0],[.525,.35],[.425,.70],[.35,1]]],[[[.583,0],[.479,.33],[.375,.68],[.333,1]]]]},   // the broth falling from the ladle into the bowl on its board
  th_wang: {kind:'sunray',wide:[.34,0,.88,.66],phone:[.18,0,.78,.52],angles:[-.35,.32],sway:[.090,.075]},   // daylight falling in a clean band across the pavilion's teak floor
  th_curry: {kind:'sunray',wide:[.58,0,1,.62],phone:[.35,0,.90,.44],angles:[-.30,.30],sway:[.085,.080]},   // the yard beyond the open side, under the raised house
  // The foi thong threads. Wide: they leave the perforated tip of the cone at y .455 and land on the nest on the
  // syrup at y .640, running dead straight at x .234 to .263. Portrait: tip y .524, nest y .626, x .355 to .428.
  th_sweets: {kind:'stream-glint',wide:[.230,.455,.268,.640],phone:[.350,.524,.432,.626],color:'#f7cf5e',
    paths:[[[[.47,0],[.45,.5],[.46,1]]],[[[.50,0],[.49,.5],[.50,1]]]]},   // the golden threads drawn down from the cone onto the syrup
  th_shophouse: {kind:'embers',wide:[.15,.55,.40,.70],phone:[.44,.655,.80,.77],color:'#ffcf6e'},   // sparks off the charcoal ring the wok's flame rises from
  th_paddy: {kind:'mist',wide:[.12,.175,.80,.255],phone:[.10,.130,.88,.215],alpha:.42},   // the hazy horizon over the flooded squares at harvest
  th_isan: {kind:'leaves',wide:[.02,0,.30,.26],phone:[.62,.02,.90,.28],leaf:'olive',color:'#7f9a4e',count:8,size:1.6},   // the bamboo grove beyond the fence, widened to its full span on 2026-09-22 after the wide painting measured under floor
  th_lanna: {kind:'sunray',wide:[.42,0,.98,.66],phone:[.24,0,.86,.46],angles:[-.38,.34],sway:[.090,.080]},   // the cool daylight through the open side, onto the raised floor
  th_andaman: {kind:'mist',wide:[.42,.18,.95,.30],phone:[.33,.295,.88,.385],alpha:.46},   // the midday haze on the green water at the foot of the karsts
  // Every phone box here stops at or before x .906, which is the right edge of the slice a 390-wide viewport shows
  // of a portrait painting; a `sunray` whose box edge is the painting's own edge is not faded by the engine, so a
  // box that ran to 1.0 would have been cut off square in mid-air on a phone. Four were pulled in on 2026-09-22:
  // th_curry to .90, th_isan to .90, th_muslim to .90 and th_sweets's doorway beam in thailand-ambience.ts to .90.
  // The sunset the room is lit by. This was `birds` until 2026-09-22, when the wide painting measured 2.55 per cent
  // against a 3 per cent floor: two bird silhouettes are a rounding error in a changed-pixel count, and the low
  // light coming in over the water is the largest thing the painting actually does. The birds keep the room's one
  // ambience slot instead (thailand-ambience.ts), which is the same trade Spain's cheese farm made in reverse.
  th_muslim: {kind:'sunray',wide:[.46,0,1,.66],phone:[.32,0,.90,.52],angles:[.34,.30],sway:[.095,.085]},   // the low sun over the mangrove, through the open cooking side
  th_baba: {kind:'sunray',wide:[.36,0,.72,.58],phone:[.26,0,.72,.50],angles:[.25,.22],sway:[.090,.085]},   // the airwell's shaft of last daylight onto the tiled floor
  // Vietnam: one signature per room, measured on each painting's own pixels. No Vietnam room uses a breeze crop.
  // Every one of the twelve pictures was composed with an empty peg, rail, nail or beam, and its hanging object
  // arrived as a separate keyed sprite, so the hanging motion of this area is a `vn-*` sprite over clean wall,
  // post or sky (see scenes-vietnam.ts) and nothing is cut out of a finished painting. Four rooms sign with a
  // traced pour or fall, because a poured bowl is what those paintings are of; the rest sign with light, sky,
  // foliage or sparks the painting already draws. Every box and path is in docs/vietnam-rooms.md with its pixels.
  // The phở pour: the lip of the small pan down to the broth surface in the resting bowl.
  // Wide: lip (.494, .527), thread through (.499, .580), surface (.504, .625).
  // Portrait: lip (.534, .506), through (.553, .550) and (.562, .590), surface (.573, .622).
  vn_pho: {kind:'stream-glint',wide:[.483,.525,.512,.628],phone:[.468,.553,.508,.642],color:'#f2e3b4',
    paths:[[[[.38,0],[.55,.53],[.72,1]]],[[[.25,0],[.40,.35],[.58,.70],[.73,1]]]]},   // the ladle of stock going into the waiting bowl
  vn_bun_cha: {kind:'embers',wide:[.255,.600,.315,.700],phone:[.525,.605,.615,.700],color:'#ffbe5c'},   // sparks off the flare under the pork on the tongs
  vn_banh_cuon: {kind:'sunray',wide:[.44,0,.80,.70],phone:[.18,0,.77,.55],angles:[-.34,.30],sway:[.095,.085]},   // the courtyard daylight the steamer works in
  // The one room in the set with no steam anywhere, so its signature has to carry it alone. Gulls over the paddy
  // sky were measured first and were not enough: four capture pairs at 1280 x 720 and four at 390 x 844 put the
  // whole room at 0.1 to 0.2 per cent of the frame changing in two seconds, against a 2.5 per cent floor, because
  // two bird strokes and five sparks are a rounding error in a changed-pixel count. The courtyard's own daylight
  // takes the signature instead: the painting is lit hard from the upper right, the door frame and the mortar
  // throw their shadows down to the left across the paving, and the beam follows that direction.
  vn_com_vong: {kind:'sunray',wide:[.28,0,.78,.66],phone:[.28,0,.86,.52],angles:[.34,.30],sway:[.095,.085]},   // the sun through the courtyard tree, the one cue in the set's one cold room
  // The Huế broth: the lip of the ladle, through the strainer the other hand holds, to the broth in the bowl.
  // Wide: lip (.3865, .414), thread through (.396, .440), (.402, .520) and (.400, .580), surface (.398, .628).
  // Portrait: lip (.534, .506), through (.553, .550) and (.562, .590), surface (.573, .622).
  vn_bun_bo_hue: {kind:'stream-glint',wide:[.378,.412,.412,.632],phone:[.522,.504,.592,.626],color:'#f6c06a',
    paths:[[[[.25,0],[.53,.13],[.71,.49],[.65,.76],[.59,1]]],[[[.17,0],[.44,.38],[.57,.71],[.73,1]]]]},   // the strained broth from the ladle lip to the bowl
  vn_hue_cakes: {kind:'sunray',wide:[.62,0,1,.72],phone:[.52,0,.90,.52],angles:[.42,.38],sway:[.090,.080]},   // the side window's light across the cake bench
  vn_cao_lau: {kind:'sunray',wide:[.56,0,.88,.66],phone:[.42,0,.80,.50],angles:[.38,.32],sway:[.095,.085]},   // the river door at the back of the shophouse
  // The turmeric pour: the lip of the ladle down to the noodles in the shallow bowl, which the broth only just
  // reaches. Wide: lip (.384, .547), through (.388, .590) and (.391, .635), surface (.393, .663).
  // Portrait: lip (.468, .545), through (.478, .570) and (.486, .610), surface (.494, .640).
  vn_mi_quang: {kind:'stream-glint',wide:[.374,.545,.404,.666],phone:[.456,.543,.506,.642],color:'#f3b73f',
    paths:[[[[.33,0],[.47,.37],[.57,.74],[.63,1]]],[[[.24,0],[.44,.27],[.60,.68],[.76,1]]]]},   // one measured ladle of broth into the shallow bowl
  vn_bread_pate: {kind:'sunray',wide:[.50,0,.88,.70],phone:[.40,0,.86,.55],angles:[-.32,.34],sway:[.095,.085]},   // the colonnade light off the street the counter faces
  // The drain: water off the wire basket, in its own painted column, into the stock it came out of.
  // Wide: the drops leave the basket at (.302, .565) and land on the stock surface at (.303, .755), which is
  // where the painting draws its own ring. Portrait: they leave at (.297, .527) and fade out at the pot's near
  // rim at (.295, .598) — that end shows steel, not liquid, so the portrait takes no splash.
  vn_hu_tieu: {kind:'drip',wide:[.288,.562,.316,.760],phone:[.283,.525,.313,.600],color:'#e7eff2',period:1.5,
    splash:[true,false],
    paths:[[[[.47,0],[.48,.5],[.50,1]]],[[[.47,0],[.45,.5],[.40,1]]]]},   // the wire basket's one shake, off the noodles and back into the stock
  vn_banh_xeo: {kind:'birds',wide:[.50,.025,.63,.125],phone:[.47,.105,.72,.175],period:6,scale:1.5},   // the clean sky between the palms over the canal
  // The glaze: the dark reduced sauce going back over the fish, traced on each composition's own fall.
  // Wide: it runs off the brush tip at (.608, .657) and reaches the glaze pooled round the fish at (.612, .682).
  // Portrait: it leaves the lip of the tilted bowl at (.740, .505) and lands in the pot at (.742, .535).
  vn_mekong_home: {kind:'drip',wide:[.596,.655,.624,.686],phone:[.730,.503,.754,.538],color:'#d9a04a',period:2.1,
    splash:[true,true],
    paths:[[[[.43,0],[.50,.5],[.57,1]]],[[[.42,0],[.46,.5],[.50,1]]]]},   // the glaze going back over the fish in the open clay pot
};

/** Extra source-observed motion for Xinjiang rooms whose signature alone is too quiet. */
export const XINJIANG_AMBIENCE: Record<string, AmbientPatch[]> = {
  kebab_grill: [
    {kind:'breeze',wide:[.324,.065,.35,.145],phone:[.755,.035,.825,.145],period:5.8,sway:[.24,.150],source:'grape'}   // a tight bunch needs a wider swing to read,
  ],
  naan_bakery: [
    {kind:'leaves',wide:[.70,.02,.94,.30],phone:[.63,.035,.92,.20],leaf:'yellow',color:'#c99235'},
  ],
  oasis_field: [
    {kind:'birds',wide:[.58,.025,.95,.18],phone:[.56,.025,.98,.15],period:6,scale:1.8},
    {kind:'breeze',wide:[.275,0,.325,.14],phone:[.185,.03,.265,.14],period:5.9,sway:[.120,.16],source:'grape'},
  ],
  grape_courtyard: [
    // Two isolated bunches per composition, staggered so the trellis breathes without moving as one sheet.
    {kind:'breeze',wide:[.665,.0,.735,.18],phone:[.64,.0,.76,.16],period:5.4,sway:[.130,.150],source:'grape'},
    {kind:'breeze',wide:[.18,.0,.24,.15],phone:[.455,.105,.56,.205],period:6.2,sway:[.150,.210],source:'grape'},
  ],
  chaikhana: [
    {kind:'breeze',wide:[.408,.02,.458,.10],phone:[.445,.075,.505,.185],period:5.7,sway:[.21,.150],source:'grape'},
    {kind:'leaves',wide:[.06,.04,.28,.24],phone:[.55,.14,.87,.30],leaf:'yellow',color:'#c99235'},
  ],
  xj_home: [
    // Keep the small autumn leaves inside the open courtyard, above and away from the family.
    {kind:'leaves',wide:[.41,.015,.57,.30],phone:[.10,.015,.55,.19],leaf:'yellow',color:'#c99235'},
  ],
  evening_feast: [
    {kind:'breeze',wide:[.236,.015,.262,.135],phone:[.27,.018,.335,.104],period:5.6,sway:[.155,.180],source:'grape'},
    {kind:'sunray',wide:[.44,0,.96,.72],phone:[.46,.015,.96,.68],angles:[-.40,.34]},
  ],
};
type AmbientArt = {
  leaves: HTMLImageElement[];
  breeze?: Array<[wide?: BreezeLayer, phone?: BreezeLayer]>;
};
type BreezeLayer = { background: HTMLCanvasElement; foreground: HTMLCanvasElement };

/** Match scene.ts's portrait-image expansion, including portrait tablets. */
export function paintingFrame(portrait: boolean, visibleWidth: number) {
  if (!portrait) return { x: -8, y: -5, width: 1616, height: 910 };
  // SVG uses xMidYMid slice: wider portrait tablets crop the top and bottom, rather than stretch.
  const aspect = 941 / 1672, width = Math.max(910 * aspect, visibleWidth), height = width / aspect;
  return { x: (1600 - width) / 2, y: -5 + (910 - height) / 2, width, height };
}
const fraction = (n: number) => n - Math.floor(n);
/** "#e8f1ef" → "232,241,239", so an effect can fade its own configured colour out to nothing. */
const hexTint = (hex: string) => { const n = parseInt(hex.replace('#',''),16); return `${(n>>16)&255},${(n>>8)&255},${n&255}`; };
/** A stable per-index scatter, so a stateless draw still looks unrepeating. */
const scatter = (n: number) => fraction(Math.sin(n*12.9898)*43758.5453);

/** A deliberately narrow colour key for a source-observed hanging subject. */
export function isBreezePixel(subject: AmbientPatch['source']='chilli', r: number, g: number, b: number) {
  const chilli=r>55&&r-g>24&&r>g*1.38&&r>b*1.16;
  // A ristra on a warm-lit ochre or whitewashed wall: the Spanish paintings glow orange, so the chilli key would carry the wall along.
  const ristra=r>60&&r-g>45&&r>g*1.75&&r>b*1.6;
  const max=Math.max(r,g,b),min=Math.min(r,g,b),chroma=max-min;
  const hue=chroma===0?0:max===r?60*((g-b)/chroma%6):max===g?60*((b-r)/chroma+2):60*((r-g)/chroma+4);
  const grape=max>35&&max<215&&chroma/max>.165&&(hue<25||hue>310);
  const garlic=r>145&&g>120&&b>82&&r-g<58&&g-b<58;
  const bell=max<155&&r>g*.9&&g>b*.85;
  const leaves=g>55&&g-r>10&&g>b*1.08;
  return subject==='ristra'?ristra:subject==='grape'?grape:subject==='garlic'?garlic:subject==='bell'?bell:subject==='leaves'?leaves:chilli;
}

/** Separate one hanging painted subject, then reconstruct the few pixels behind it. */
function prepareBreezeLayer(image: HTMLImageElement, rect: PaintingRect, subject: AmbientPatch['source']='chilli'): BreezeLayer | undefined {
  if (typeof document === 'undefined') return;
  const width=Math.max(1,Math.round((rect[2]-rect[0])*image.naturalWidth));
  const height=Math.max(1,Math.round((rect[3]-rect[1])*image.naturalHeight));
  const source=document.createElement('canvas');source.width=width;source.height=height;
  const sourceCtx=source.getContext('2d',{willReadFrequently:true});if(!sourceCtx)return;
  sourceCtx.drawImage(image,rect[0]*image.naturalWidth,rect[1]*image.naturalHeight,width,height,0,0,width,height);
  const original=sourceCtx.getImageData(0,0,width,height),mask=new Uint8Array(width*height);
  for(let i=0;i<mask.length;i++) {
    const p=i*4,r=original.data[p],g=original.data[p+1],b=original.data[p+2];
    // Conservative colour keys keep trellis, leaves, walls and people in the static painting.
    if(isBreezePixel(subject,r,g,b))mask[i]=1;
  }
  // Carry darker painted edges that touch each colour core, without spreading into the surroundings.
  for(let pass=0;pass<(subject==='grape'?3:subject==='leaves'?2:1);pass++) {
    const next=mask.slice();
    for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++)if(!mask[y*width+x]) {
      for(let yy=-1;yy<=1&&!next[y*width+x];yy++)for(let xx=-1;xx<=1;xx++)if(mask[(y+yy)*width+x+xx]){next[y*width+x]=1;break;}
    }
    mask.set(next);
  }
  if(subject==='grape'||subject==='bell'||subject==='leaves'||subject==='ristra') {
    // Keep only the main connected subject so similarly coloured scenery remains part of the static painting.
    // A ristra keeps every string that is at least a quarter of the largest one, so paired strings sway together
    // while flecks of warm wall, wood and ham stay put.
    const seen=new Uint8Array(mask.length),queue=new Int32Array(mask.length),components:Int32Array[]=[];
    for(let start=0;start<mask.length;start++)if(mask[start]&&!seen[start]) {
      let head=0,tail=0;queue[tail++]=start;seen[start]=1;
      while(head<tail) {
        const current=queue[head++],y=Math.floor(current/width);
        const neighbours=[current-1,current+1,current-width,current+width];
        for(const next of neighbours)if(next>=0&&next<mask.length&&!seen[next]&&mask[next]
          &&(next===current-width||next===current+width||Math.floor(next/width)===y)) {seen[next]=1;queue[tail++]=next;}
      }
      components.push(queue.slice(0,tail));
    }
    const largest=components.reduce((m,c)=>Math.max(m,c.length),0);
    const kept=subject==='ristra'?components.filter(c=>c.length>=largest*.25):components.filter(c=>c.length===largest).slice(0,1);
    mask.fill(0);for(const component of kept)for(const pixel of component)mask[pixel]=1;
  }
  const foreground=document.createElement('canvas');foreground.width=width;foreground.height=height;
  const foregroundCtx=foreground.getContext('2d');if(!foregroundCtx)return;
  const foregroundPixels=new ImageData(new Uint8ClampedArray(original.data),width,height);
  for(let i=0;i<mask.length;i++)foregroundPixels.data[i*4+3]=mask[i]?255:0;
  foregroundCtx.putImageData(foregroundPixels,0,0);

  const background=document.createElement('canvas');background.width=width;background.height=height;
  const backgroundCtx=background.getContext('2d');if(!backgroundCtx)return;
  const backgroundPixels=new ImageData(new Uint8ClampedArray(original.data),width,height),data=backgroundPixels.data;
  // Fill each horizontal subject run from the static wall beside it. The moving foreground covers most of this
  // repair; it is visible only in the gap opened by the sway. Each row blends the mean of a few pixels either side
  // rather than one pixel, and the filled rows are then averaged vertically, so the revealed strip reads as wall
  // rather than as streaks (the streaks were what the owner saw beside every Spanish pepper string).
  // The pixels touching the subject are its painted outline and cast shadow, so the sample skips the first three
  // and averages the eight beyond them: the fill is the wall's own colour, not a dark ghost of the string.
  // Pixels within four of the subject are its outline and cast shadow, and the gaps between peppers are shadow
  // too, so a sample walks outward past all of that and averages up to eight clear wall pixels.
  const near=new Uint8Array(mask.length);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(mask[y*width+x])for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const yy=y+dy,xx=x+dx;if(yy>=0&&yy<height&&xx>=0&&xx<width)near[yy*width+xx]=1;}
  // Samples also skip anything the subject's own key would take (a second string, a ham), so the fill never
  // carries a red tint. The whole shadow ring and the gaps between peppers are filled, not only the subject.
  const sample=(y: number, from: number, step: number) => {
    const acc=[0,0,0];let n=0;
    for(let k=0,px=from;k<40&&n<8&&px>=0&&px<width;k++,px+=step){
      if(near[y*width+px])continue;const at=(y*width+px)*4;
      const sr=original.data[at],sg=original.data[at+1],sb=original.data[at+2];
      if(isBreezePixel(subject,sr,sg,sb)||(sr>sg*1.5&&sr-sg>35))continue;   // the subject's own key, or any red at all (a ham, a shadowed pepper)
      for(let c=0;c<3;c++)acc[c]+=original.data[at+c];n++;
    }
    return n?acc.map(v=>v/n):undefined;
  };
  for(let y=0;y<height;y++)for(let x=0;x<width;) {
    if(!near[y*width+x]){x++;continue;}
    const start=x;while(x<width&&near[y*width+x])x++;const end=x-1;
    const left=sample(y,start-1,-1),right=sample(y,end+1,1),l=left??right,r=right??left;
    if(!l||!r)continue;
    for(let px=start;px<=end;px++) {
      const mix=(px-start+1)/(end-start+2),to=(y*width+px)*4;
      for(let c=0;c<3;c++)data[to+c]=Math.round(l[c]*(1-mix)+r[c]*mix);
    }
  }
  // Vertical average over the filled pixels only (radius 8), which removes the row-to-row noise of the fill.
  const filled=new Uint8ClampedArray(data);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(near[y*width+x]) {
    const acc=[0,0,0];let n=0;
    for(let dy=-8;dy<=8;dy++){const yy=y+dy;if(yy<0||yy>=height||!near[yy*width+x])continue;const at=(yy*width+x)*4;for(let c=0;c<3;c++)acc[c]+=filled[at+c];n++;}
    const to=(y*width+x)*4;for(let c=0;c<3;c++)data[to+c]=Math.round(acc[c]/n);
  }
  backgroundCtx.putImageData(backgroundPixels,0,0);
  return {background,foreground};
}

/** Source layers are allowed only for tightly cropped hanging details that pivot in place. */
export function ambientPainter(patches: AmbientPatch[], folder?: string) {
  const leaves = patches.some(p => p.kind === 'leaves' && !p.leaf) ? [2, 3, 5, 6, 7].map(i => {
    const image = new Image(); image.src = `${import.meta.env.BASE_URL}scenes/hotpot/leaf-${i}.png`; return image;
  }) : [];
  const breeze: AmbientArt['breeze'] = patches.map(() => []);
  // The sampler reads the very picture the room is showing, at the very URL the room asked for, and only for the
  // orientation on screen: so it is a cache hit on the painting the visitor is already looking at, never a second
  // download and never the other orientation's file. A patch stays unprepared, and so draws nothing, until that
  // image has loaded — there is no swaying string before there is a painted string to sway.
  const sampled=[false,false];
  const sample=(orientation: 0|1) => {
    if(!folder||sampled[orientation]||!patches.some(p=>p.kind==='breeze'&&(orientation?p.phone:p.wide)))return;
    sampled[orientation]=true;
    const image=new Image();image.onload=()=>patches.forEach((patch,index)=>{
      const rect=orientation?patch.phone:patch.wide;
      if(patch.kind==='breeze'&&rect)breeze[index][orientation]=prepareBreezeLayer(image,rect,patch.source);
    });
    image.src=`${import.meta.env.BASE_URL}scenes/${folder}/${orientation?'portrait':'wide'}.jpg`;
  };
  return (ctx: CanvasRenderingContext2D, t: number, portrait: boolean) => { sample(portrait?1:0); drawAmbience(ctx, t, portrait, patches, { leaves, breeze }); };
}

let sunrayCanvas: HTMLCanvasElement | undefined;
/** One reusable scratch canvas for the sunray fade; returns nothing where there is no DOM or no 2d context. */
function sunrayScratch(width: number, height: number): HTMLCanvasElement | undefined {
  if (typeof document === 'undefined') return;
  try {
    if (!sunrayCanvas) sunrayCanvas = document.createElement('canvas');
    if (sunrayCanvas.width < width || sunrayCanvas.height < height) { sunrayCanvas.width = Math.max(sunrayCanvas.width, width); sunrayCanvas.height = Math.max(sunrayCanvas.height, height); }
    const context = sunrayCanvas.getContext('2d') as Partial<CanvasRenderingContext2D> | null;
    return typeof context?.setTransform === 'function' && typeof context.createLinearGradient === 'function' ? sunrayCanvas : undefined;
  } catch { return; }
}

export function drawAmbience(ctx: CanvasRenderingContext2D, t: number, portrait: boolean, patches: AmbientPatch[],
  art?: AmbientArt) {
  if (!patches.length) return;
  const opacity = ctx.globalAlpha;
  const frame = paintingFrame(portrait, ctx.canvas.width / ctx.getTransform().a);
  for (const [index, patch] of patches.entries()) {
    const r = portrait ? patch.phone : patch.wide;
    if (!r) continue;
    const x = frame.x + r[0] * frame.width, y = frame.y + r[1] * frame.height;
    const w = (r[2] - r[0]) * frame.width, h = (r[3] - r[1]) * frame.height;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (patch.kind === 'breeze') {
      const layer=art?.breeze?.[index]?.[portrait?1:0];
      if(layer) {
        // Paint out the original hanging subject, then move its exact pixels from the pictured tie point.
        ctx.drawImage(layer.background,x,y,w,h);
        const amplitude = patch.sway?.[portrait ? 1 : 0] ?? (portrait ? .07 : .052);
        const sway = Math.sin(t * (Math.PI * 2 / (patch.period ?? 7.2)) + index * .8) * amplitude;
        ctx.translate(x+w*.5,y);ctx.rotate(sway);ctx.globalAlpha=opacity;
        ctx.drawImage(layer.foreground,-w*.5,0,w,h);
      }
    } else if (patch.kind === 'sunray') {
      // One broad beam follows the composition's light direction; soft edges keep it part of the painting.
      const angle = patch.angles?.[portrait ? 1 : 0] ?? -.4;
      const length = Math.hypot(w,h) * 1.25, beam = Math.min(w,h) * .26;
      const drift=patch.sway?.[portrait ? 1 : 0] ?? .012;
      const cx=w*(.50+Math.sin(t*.28)*drift), cy=h*(.48+Math.sin(t*.19)*drift*.55);
      const paintRay=(target: CanvasRenderingContext2D, ox: number, oy: number) => {
        target.save(); target.translate(ox+cx,oy+cy); target.rotate(angle);
        const ray=target.createLinearGradient(-beam/2,0,beam/2,0);
        ray.addColorStop(0,'rgba(255,225,158,0)');ray.addColorStop(.22,'rgba(255,225,158,.16)');
        ray.addColorStop(.5,'rgba(255,244,214,.52)');ray.addColorStop(.78,'rgba(255,225,158,.16)');ray.addColorStop(1,'rgba(255,225,158,0)');
        target.fillStyle=ray;target.fillRect(-beam/2,-length/2,beam,length);target.restore();
      };
      ctx.globalCompositeOperation='screen';
      ctx.globalAlpha=opacity*(.68+Math.sin(t*.55)*.08);
      // The beam is clipped to its box, and a box that stops inside the painting (the tapas bar's ends at .68 of the
      // height, above the table) showed a straight cut where the light stopped. Where a box edge is not the edge of
      // the painting, the beam now fades out over the last fifth of the box on that side, drawn through a scratch
      // canvas so the fade multiplies only the light and not the painting under it.
      const inner=[r[0]>.001, r[1]>.001, r[2]<.999, r[3]<.999];
      const scratch=inner.some(Boolean)?sunrayScratch(Math.ceil(w),Math.ceil(h)):undefined;
      if(scratch) {
        const o=scratch.getContext('2d')!;
        o.setTransform(1,0,0,1,0,0);o.globalCompositeOperation='source-over';o.globalAlpha=1;o.clearRect(0,0,scratch.width,scratch.height);
        paintRay(o,0,0);
        o.globalCompositeOperation='destination-in';
        const fade=(x0: number, y0: number, x1: number, y1: number) => {
          const g=o.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,1)');
          o.fillStyle=g;o.fillRect(0,0,w,h);
        };
        if(inner[0])fade(0,0,w*.20,0);if(inner[2])fade(w,0,w*.80,0);
        if(inner[1])fade(0,0,0,h*.22);if(inner[3])fade(0,h,0,h*.78);
        ctx.drawImage(scratch,0,0,w,h,x,y,w,h);
      } else paintRay(ctx,x,y);
    } else if (patch.kind === 'light') {
      // A slow, warm lamp shimmer, never a whole-image flash.
      const glow = .32 + Math.sin(t * 1.5 + index) * .10 + Math.sin(t * 3.7 + index * 2) * .035;
      ctx.translate(x + w / 2, y + h / 2); ctx.scale(w / 2, h / 2);
      const light = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      light.addColorStop(0, `rgba(255,225,158,${glow + .15})`);
      light.addColorStop(.28, `rgba(255,191,98,${glow})`);
      light.addColorStop(1, 'rgba(255,176,72,0)');
      ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = light;
      ctx.fillRect(-1, -1, 2, 2);
    } else if (patch.kind === 'stream-glint' || patch.kind === 'waterfall-glint' || patch.kind === 'drip') {
      // Trace only verified liquid already present in this exact composition. There is deliberately
      // no generic centreline or evenly distributed fallback: an untraced rectangle draws nothing.
      const paths=patch.paths?.[portrait?1:0];
      if(paths?.length&&patch.kind==='drip'){
        // A pictured drip, not a pour: the painting shows separate drops leaving a lip and landing in a vessel, so
        // the code releases separate drops instead of running a dash down a thread. Each drop starts at the first
        // traced point, accelerates along the path under gravity and disappears at the last point, where a small
        // ring opens on the surface and fades. Colour and alpha stay modest: this sits on a finished painting that
        // already draws the drops, and it must read as the same liquid moving, not as a new object.
        const tint=hexTint(patch.color??'#f3ead6');
        for(const [pathIndex,path] of paths.entries()){
          if(path.length<2)continue;
          const point=(k: number) => {
            const span=(path.length-1)*Math.min(1,Math.max(0,k)),seg=Math.min(path.length-2,Math.floor(span)),f=span-seg;
            return [x+w*(path[seg][0]+(path[seg+1][0]-path[seg][0])*f), y+h*(path[seg][1]+(path[seg+1][1]-path[seg][1])*f)] as const;
          };
          // The drop is the width of the painted thread, not of the box, so the width factor is generous and the
          // floor does the work in a narrow box: a portrait thread clipped to twenty thousandths of the painting
          // would otherwise get a drop a pixel across and nothing would read.
          const period=patch.period??1.9, drops=3, radius=Math.max(2,Math.min(w*.22,h*.027,3.6));
          for(let i=0;i<drops;i++){
            // phase^1.55 is the gravity: the drop leaves the lip slowly and is quickest as it reaches the surface
            const phase=fraction((t+pathIndex*.37)/period+i/drops), fall=Math.pow(phase,1.55);
            const [dx,dy]=point(fall);
            ctx.globalAlpha=opacity*.54*Math.min(1,phase*7,(1-phase)*5);
            ctx.fillStyle=`rgba(${tint},.85)`;
            ctx.beginPath();ctx.ellipse(dx,dy,radius*.72,radius*(1+fall*.55),0,0,Math.PI*2);ctx.fill();
          }
          // One ring per released drop, opening where the last traced point sits on the painted surface — but only
          // where a surface is pictured there. Where the thread passes behind a rim the drop simply fades out at it.
          if(patch.splash?.[portrait?1:0]!==false){
            const splash=fraction((t+pathIndex*.37)/period*drops),[sx,sy]=point(1);
            ctx.globalAlpha=opacity*.34*Math.max(0,1-splash);
            ctx.strokeStyle=`rgba(${tint},.9)`;ctx.lineWidth=1;
            ctx.beginPath();ctx.ellipse(sx,sy,radius*(.6+splash*3.4),radius*(.22+splash*1.1),0,0,Math.PI*2);ctx.stroke();
          }
        }
      } else if(paths?.length){
        ctx.globalCompositeOperation='screen';ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=patch.color??'#e8f8ed';
        ctx.lineWidth=patch.kind==='waterfall-glint'?(portrait?4.2:3.4):Math.max(1,Math.min(2,w*.16));
        const unit=Math.max(3,h*(patch.kind === 'waterfall-glint' ? .20 : .30));ctx.setLineDash([unit,unit*1.7]);
        for(const [pathIndex,path] of paths.entries()){
          if(path.length<2)continue;ctx.globalAlpha=opacity*(.82+.14*Math.sin(t*.8+pathIndex));
          // A poured thread falls at roughly its own length every second; the dash speed scales with the box height
          // the way the dash length already does, so a tall cider or sherry pour no longer creeps.
          ctx.lineDashOffset=-(t*Math.max(patch.kind==='waterfall-glint'?10:7,h*(patch.kind==='waterfall-glint'?.9:1.6))+pathIndex*unit*.7);
          ctx.beginPath();ctx.moveTo(x+w*path[0][0],y+h*path[0][1]);
          for(const point of path.slice(1))ctx.lineTo(x+w*point[0],y+h*point[1]);ctx.stroke();
        }
      }
    } else if (patch.kind === 'leaves') {
      const leafCount = Math.min(8, Math.max(1, patch.count ?? 4));
      for (let i = 0; i < leafCount; i++) {
        // Already in flight on entry. Different speeds and flutter phases prevent a repeated curtain.
        const phase = fraction(t / (7.5 + i * 1.7) + i * .271 + .13);
        const flutter = Math.sin(t * (1.3 + i * .17) + i * 2.3);
        const px = x + w * (.10 + fraction(i * .618) * .80 + flutter * .10 + (phase - .5) * .10);
        const py = y + h * (.04 + phase * .92);
        const size = (patch.leaf === 'yellow' || patch.leaf === 'blossom' ? (portrait ? 16 : 20) : (portrait ? 25 : 35)) * (.78 + (i % 4) * .12) * (patch.size ?? 1);
        ctx.save(); ctx.translate(px, py); ctx.rotate(i + t * (i % 2 ? .65 : -.48) + flutter * .55);
        ctx.scale(.28 + .72 * Math.abs(Math.cos(t * .95 + i)), 1);
        ctx.globalAlpha = opacity * .94 * Math.min(1, phase * 9, (1 - phase) * 9);
        const image = art?.leaves[i % art.leaves.length];
        if (!patch.leaf && image?.complete && image.naturalWidth) {
          const leafWidth = size * image.naturalWidth / image.naturalHeight;
          ctx.drawImage(image, -leafWidth / 2, -size / 2, leafWidth, size);
        } else {
          // Procedural leaves are reserved for small yellow autumn leaves and narrow evergreen olive leaves.
          const width = size * (patch.leaf === 'olive' ? .20 : patch.leaf === 'blossom' ? .55 : .35);
          const shade = ctx.createLinearGradient(-width, 0, width, 0);
          const edge=patch.leaf==='yellow'?(patch.color??'#d7a632'):patch.leaf==='blossom'?(patch.color??'#f3c9d4'):(patch.color??'#7c873f');
          shade.addColorStop(0, edge); shade.addColorStop(.5, patch.leaf==='yellow'?'#f0c95a':patch.leaf==='blossom'?'#fff4f7':'#d0ce92');
          shade.addColorStop(1, patch.leaf==='yellow'?'#aa7025':patch.leaf==='blossom'?'#e8a9bb':'#657b45');
          ctx.fillStyle = shade; ctx.beginPath(); ctx.moveTo(0, -size / 2);
          ctx.quadraticCurveTo(width, 0, 0, size / 2); ctx.quadraticCurveTo(-width, 0, 0, -size / 2); ctx.fill();
          ctx.strokeStyle = patch.leaf==='yellow'?'#e2ad48':patch.leaf==='blossom'?'#f7dde4':'#ddd7ac'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(0, -size * .37); ctx.lineTo(0, size * .38); ctx.stroke();
        }
        ctx.restore();
      }
    } else if (patch.kind === 'birds') {
      // Small distant silhouettes cross the open sky, with a pause between each pair.
      for (let i = 0; i < 2; i++) {
        // Cross often enough that a normal room visit cannot land entirely in a long empty interval.
        const phase = fraction((t + 2 - i * 1.5) / (patch.period ?? 15)) * 1.65;
        if (phase > 1) continue;
        const span = (portrait ? 8 : 11) * (i ? .7 : 1) * (patch.scale ?? 1);
        ctx.save(); ctx.translate(x + w * (.08 + phase * .84), y + h * (.45 + i * .22) + Math.sin(t * 1.4 + i) * 3);
        ctx.globalAlpha = opacity * .72 * Math.min(1, phase * 8, (1 - phase) * 8);
        ctx.strokeStyle = '#4d5147'; ctx.lineWidth = portrait ? 1.4 : 1.8; ctx.lineCap = 'round';
        const wing = -span * (.3 + Math.sin(t * 5 + i) * .6);
        ctx.beginPath(); ctx.moveTo(-span, wing); ctx.quadraticCurveTo(-span * .4, -span * .25, 0, 1);
        ctx.quadraticCurveTo(span * .4, -span * .25, span, wing); ctx.stroke(); ctx.restore();
      }
    } else if (patch.kind === 'rain') {
      // Rain on a measured pane of glass. Two things happen on a wet window and the old six identical strokes did
      // neither: rain falls past the glass in thin streaks of different length, speed and opacity, and a few drops
      // cling to the pane itself, run down it leaving a wet trail, and swallow the drop waiting below them. Every
      // mark fades out at both ends through its own gradient, so nothing ends in a hard tick, and the patch
      // rectangle is the pane, so the clip keeps all of it off the mullions, the frame and the wall.
      const tint = hexTint(patch.color ?? '#e8f1ef');
      const seed = index * 7.13;
      const lean = Math.min(w * .07, 10);   // the wind's slant across the whole fall
      const streaks = Math.max(6, Math.min(12, Math.round(w * h / 2400)));
      const bead = Math.max(1.2, Math.min(w * .05, h * .028, 4.4));
      ctx.lineCap = 'round';
      for (let i = 0; i < streaks; i++) {
        // roughly one streak in five falls much faster and much longer, and swells in and out over its own slow
        // cycle, so a quick streak reads as an occasional gust rather than as one permanently different drop
        const quick = scatter(i + seed + .31) > .80;
        const gust = quick ? Math.max(.12, Math.sin(Math.PI * fraction(t / (6.5 + scatter(i + seed + .41) * 5.5)))) : 1;
        const speed = quick ? .74 + scatter(i + seed + .19) * .3 : .22 + scatter(i + seed + .11) * .22;
        const phase = fraction(t * speed + scatter(i + seed + .57));
        const len = h * (quick ? .24 + scatter(i + seed + .05) * .13 : .06 + scatter(i + seed + .29) * .08);
        const px = x + w * (.02 + .96 * scatter(i + seed + .83)) + lean * (phase - .5);
        const py = y - len + phase * (h + len * 2);
        const slant = lean * .30 * (len / h);
        const alpha = (quick ? .30 : .12 + scatter(i + seed + .67) * .16) * gust;
        const fade = ctx.createLinearGradient(px, py, px + slant, py + len);
        fade.addColorStop(0, `rgba(${tint},0)`);
        fade.addColorStop(.42, `rgba(${tint},${alpha.toFixed(3)})`);
        fade.addColorStop(1, `rgba(${tint},0)`);
        ctx.strokeStyle = fade; ctx.lineWidth = quick ? 1.5 : 1; ctx.globalAlpha = opacity;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + slant, py + len); ctx.stroke();
      }
      const runners = Math.max(2, Math.min(5, Math.round(w / 46)));
      for (let j = 0; j < runners; j++) {
        const period = 5.4 + scatter(j + seed + 1.7) * 5.2;
        const phase = fraction(t / period + scatter(j + seed + 2.3));
        const hold = .28 + scatter(j + seed + 3.1) * .26;   // the drop gathers on the glass before it lets go
        const run = phase <= hold ? 0 : (phase - hold) / (1 - hold);
        const cx = x + w * (.08 + .84 * scatter(j + seed + 4.7));
        const top = y + h * (.03 + .12 * scatter(j + seed + 5.3)), foot = y + h * .99;
        const by = top + (foot - top) * Math.pow(run, 1.8);   // gravity: slow off the mark, quickest at the sill
        const waiting = top + (foot - top) * (.42 + .28 * scatter(j + seed + 6.1));
        const merged = by >= waiting;
        const r = bead * (.72 + .5 * scatter(j + seed + 6.9)) * (merged ? 1.35 : 1);
        const wet = ctx.createLinearGradient(cx, top, cx, by);
        wet.addColorStop(0, `rgba(${tint},0)`);
        wet.addColorStop(1, `rgba(${tint},${(.20 * Math.min(1, run * 6)).toFixed(3)})`);
        ctx.strokeStyle = wet; ctx.lineWidth = Math.max(.8, r * .62); ctx.globalAlpha = opacity;
        ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(cx, by); ctx.stroke();
        ctx.fillStyle = `rgba(${tint},.5)`; ctx.globalAlpha = opacity * (run > 0 ? 1 : .7);
        ctx.beginPath(); ctx.ellipse(cx, by, r * .8, r * (1 + run * .5), 0, 0, Math.PI * 2); ctx.fill();
        if (!merged) {
          // the drop sitting lower on the pane, until the runner reaches it and the two become one
          ctx.fillStyle = `rgba(${tint},.42)`; ctx.globalAlpha = opacity * .9;
          ctx.beginPath(); ctx.ellipse(cx, waiting, r * .62, r * .74, 0, 0, Math.PI * 2); ctx.fill();
        }
      }
    } else if (patch.kind === 'mist') {
      const mistAlpha = patch.alpha ?? .40;
      for (let i = 0; i < 4; i++) {
        ctx.save();
        // Keep the whole soft bank inside its clip, avoiding a straight fog edge as it drifts.
        ctx.translate(x + w * (.25 + i * .16 + Math.sin(t * .25 + i) * .025), y + h * (.40 + i * .055 + Math.sin(t * .32 + i) * .07));
        ctx.scale(w * .22, h * .29);
        const fog = ctx.createRadialGradient(0, 0, .08, 0, 0, 1);
        fog.addColorStop(0, `rgba(237,243,232,${mistAlpha.toFixed(2)})`); fog.addColorStop(.45, `rgba(237,243,232,${(mistAlpha*.55).toFixed(2)})`); fog.addColorStop(1, 'rgba(237,243,232,0)');
        ctx.fillStyle = fog; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    } else if (patch.kind === 'snow') {
      // Snow belongs to the outdoor opening only. The patch rectangle is the architectural boundary.
      ctx.fillStyle = patch.color ?? '#fff9e9';
      ctx.shadowColor = 'rgba(92,116,132,.30)'; ctx.shadowBlur = portrait ? 1.5 : 1.2;
      for (let i = 0; i < 16; i++) {
        const phase = fraction(t / (4.2 + i * .19) + i * .173);
        const px = x + w * (.05 + .90 * fraction(i * .417)) + Math.sin(t * (.55 + i % 3 * .11) + i) * (2 + i % 3);
        const py = y + h * phase;
        const radius=(portrait?1.35:1.05)+(i%5)*.27;
        ctx.globalAlpha = opacity * (.55 + (i % 4) * .10) * Math.min(1, phase * 8, (1 - phase) * 8);
        ctx.beginPath();
        if(i%4===0)ctx.ellipse(px,py,radius*.58,radius*1.55,t*.18+i,0,Math.PI*2);
        else ctx.arc(px,py,radius,0,Math.PI*2);
        ctx.fill();
      }
    } else if (patch.kind === 'embers') {
      // A few sparks rise from a pictured flame; no invented fuel or cookware is added.
      ctx.fillStyle = patch.color ?? '#ffd479';
      for (let i = 0; i < 5; i++) {
        const phase = fraction(t / (2.8 + i * .18) + i * .219);
        const px = x + w * (.26 + .48 * fraction(i * .371)) + Math.sin(t * 1.5 + i) * 3;
        const py = y + h * (.92 - phase * .78);
        ctx.globalAlpha = opacity * .88 * Math.sin(Math.PI * phase);
        ctx.beginPath(); ctx.arc(px, py, 2.1 + (i % 2) * .7, 0, Math.PI * 2); ctx.fill();
      }
    } else if (patch.kind === 'dust') {
      // Flour lives close to the pictured work surface: a readable soft puff, not faint full-room noise.
      ctx.fillStyle = '#f7ead0';
      for (let i = 0; i < 24; i++) {
        const phase = fraction(t * (.13+(i%3)*.008) + i * .618);
        const px = x + w * (.08+.84*fraction(i * .371)) + Math.sin(t*.8 + i) * 6;
        const py = y + h * (.96 - phase*.82);
        ctx.globalAlpha = opacity * .78 * Math.sin(Math.PI * phase); ctx.beginPath(); ctx.arc(px, py, 1.5 + (i % 4) * .48, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      const exhaustiveKind: never = patch.kind;
      throw new Error(`Unsupported ambient patch: ${exhaustiveKind}`);
    }
    ctx.restore();
  }
}
