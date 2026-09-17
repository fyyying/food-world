import type { AmbientPatch } from './scene-ambience';

// Separate compositions: crisp leaves, sky and water motion. Hanging food is handled by the
// room signature as one tightly cropped, top-pivoted source layer rather than a broad JPEG patch.
export const TURKEY_AMBIENCE: Record<string, AmbientPatch[]> = {
  tr_simit: [
    { kind: 'leaves', wide: [.53, .01, .69, .34], phone: [.39, .02, .73, .34], count: 6, size: 1.2 },
  ],
  tr_tea: [
    { kind: 'light', wide: [.105, .11, .16, .23], phone: [.21, .065, .34, .17] },
    { kind: 'leaves', wide: [.04, .02, .20, .48], phone: [.12, .025, .36, .36], count: 6, size: 1.2 },
  ],
  tr_coffee: [
    { kind: 'light', wide: [.36, .015, .447, .16], phone: [.59, .07, .73, .21] },
    { kind: 'light', wide: [.67, .12, .728, .215] },
    // the upper-left sash, re-measured on portrait.jpg 2026-09-17: its glass runs x .719 to .845 and the transom
    // begins at y .140, so the box stops two thousandths short of the mullion on the right rather than one pixel
    { kind: 'rain', phone: [.721, .050, .843, .134] },
  ],
  tr_market: [
    { kind: 'leaves', wide: [.35, .02, .51, .35], phone: [.40, .012, .68, .32], count: 8, size: 1.5 },
    { kind: 'sunray', wide: [.08,.02,.69,.92], phone: [.14,.02,.82,.90], angles: [-.42,.36] },
  ],
  tr_fish: [
    { kind: 'embers', wide: [.40, .70, .50, .86], phone: [.70, .56, .82, .70] },   // sparks from the pictured grill
  ],
  tr_kebab: [
    { kind: 'dust', wide: [.10, .54, .24, .61], phone: [.18, .55, .33, .62] },
  ],
  tr_baklava: [
    { kind: 'stream-glint', phone: [.902, .610, .916, .637], color: '#ffe2a0', paths: [undefined, [[[.88,.04],[.76,.24],[.62,.43],[.55,.69],[.38,.96]]]] },
    { kind: 'light', wide: [.61, .62, .93, .84] },
    { kind: 'dust', wide: [.24, .52, .43, .69], phone: [.27, .45, .56, .60] },
    { kind: 'birds', wide: [.65, .015, .94, .20], phone: [.70, .08, .98, .31], period: 12 },
  ],
  tr_pide: [
    { kind: 'dust', wide: [.17, .47, .33, .62], phone: [.22, .44, .45, .60] },
  ],
  tr_yufka: [
    { kind: 'leaves', wide: [.015, .03, .18, .36], phone: [.43, .015, .73, .33], count: 6, size: 1.2 },
    { kind: 'dust', wide: [.20, .55, .34, .66], phone: [.28, .52, .47, .65] },
  ],
  tr_dolma: [
    { kind: 'leaves', wide: [.035, .03, .20, .37], phone: [.82, .025, .99, .36], count: 6, size: 1.2 },
  ],
  tr_breakfast: [
    { kind: 'leaves', wide: [.52, .01, .72, .32], phone: [.57, .012, .84, .32] },
  ],
  tr_meze: [
    { kind: 'leaves', wide: [.13, .015, .42, .32], phone: [.65, .025, .96, .36] },
    { kind: 'light', wide: [.063, .01, .156, .15], phone: [.40, .005, .60, .13] },
    { kind: 'light', wide: [.466, .09, .553, .20], phone: [.55, .08, .66, .16] },
    { kind: 'birds', wide: [.26, .04, .43, .14], phone: [.78, .135, .99, .19] },
  ],
  tr_olive: [
    { kind: 'stream-glint', phone: [.911, .503, .925, .529], color: '#ffe0a0', paths: [undefined, [[[.48,.03],[.53,.34],[.58,.66],[.64,.96]]]] },
    { kind: 'stream-glint', phone: [.894, .541, .912, .573], color: '#ffe0a0', paths: [undefined, [[[.42,.03],[.46,.32],[.52,.67],[.58,.96]]]] },
    { kind: 'birds', wide: [.47, .15, .64, .22], phone: [.72, .12, .98, .17], period: 6, scale: 1.8 },   // gulls over the bay at sunset
    { kind: 'light', wide: [.56, .02, .70, .16], phone: [.62, .04, .80, .17], color: '#ffd9a0' },   // the low sun over the sea
    { kind: 'sunray', wide: [.30, 0, .80, .60], phone: [.35, 0, .95, .55], angles: [.42, .40], sway: [.05, .05] },   // the evening beam through the branches
    { kind: 'leaves', leaf: 'olive', color: '#82945e', wide: [.62, 0, .98, .22], count: 8, size: 1.3 },   // the second canopy, wide only
  ],
  tr_tea_hill: [
    { kind: 'birds', wide: [.50, 0, .96, .12], phone: [.45, 0, .98, .12], period: 8, scale: 1.5 },   // gulls in the big open sky, near enough to read
    { kind: 'sunray', wide: [.45, 0, .95, .45], phone: [.45, 0, .98, .40], angles: [-.30, -.30] },   // the sun already breaking through the clouds
  ],
  tr_supper: [
    { kind: 'leaves', wide: [.01, .025, .17, .37], phone: [.72, .015, .95, .36] },
  ],
};
