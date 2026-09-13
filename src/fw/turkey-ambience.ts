import type { AmbientPatch } from './scene-ambience';

// Separate compositions: moving foliage stays clear of faces, hands and architecture.
// Each room has a visible, continuously animated feature in both orientations.
export const TURKEY_AMBIENCE: Record<string, AmbientPatch[]> = {
  tr_simit: [
    { kind: 'breeze', wide: [.53, 0, .70, .16], phone: [.34, 0, .79, .105] },
    { kind: 'leaves', wide: [.54, .01, .66, .24], phone: [.41, .02, .69, .24] },
    { kind: 'water', wide: [.710, .357, .758, .378], phone: [.735, .348, .875, .358] },
  ],
  tr_tea: [
    { kind: 'breeze', wide: [.26, 0, .53, .20], phone: [.42, 0, .78, .20] },
    { kind: 'light', wide: [.105, .11, .16, .23], phone: [.21, .065, .34, .17] },
    { kind: 'leaves', wide: [.04, .02, .15, .45], phone: [.02, .025, .12, .29] },
    { kind: 'water', wide: [.68, .403, .735, .429], phone: [.875, .325, .965, .347] },
  ],
  tr_coffee: [
    { kind: 'light', wide: [.36, .015, .447, .16], phone: [.59, .07, .73, .21] },
    { kind: 'light', wide: [.67, .12, .728, .215] },
    { kind: 'rain', wide: [.808, .09, .923, .30] },
    { kind: 'rain', phone: [.715, .05, .846, .132] },
    { kind: 'rain', phone: [.899, .03, .99, .127] },
    { kind: 'rain', phone: [.903, .164, .991, .306] },
  ],
  tr_market: [
    { kind: 'breeze', wide: [.35, 0, .50, .17], phone: [.40, 0, .65, .17] },
    { kind: 'leaves', wide: [.35, .02, .48, .26], phone: [.40, .012, .61, .23] },
  ],
  tr_fish: [
    { kind: 'water', wide: [.726, .386, .835, .409], phone: [.645, .283, .819, .324], color: '#f8dda0' },
    { kind: 'water', wide: [.852, .365, .919, .405], color: '#f8dda0' },
    { kind: 'light', wide: [.004, .235, .045, .32], phone: [.003, .20, .065, .28] },
  ],
  tr_kebab: [
    { kind: 'breeze', wide: [.50, .02, .69, .20], phone: [.49, 0, .75, .16] },
    { kind: 'dust', wide: [.10, .54, .24, .61], phone: [.18, .55, .33, .62] },
  ],
  tr_baklava: [
    { kind: 'light', wide: [.539, .012, .599, .145] },
    { kind: 'breeze', wide: [.595, .012, .658, .13], phone: [.72, .035, .97, .145] },
    { kind: 'dust', wide: [.24, .52, .43, .69], phone: [.27, .45, .56, .60] },
  ],
  tr_pide: [
    { kind: 'dust', wide: [.17, .47, .33, .62], phone: [.22, .44, .45, .60] },
  ],
  tr_yufka: [
    { kind: 'breeze', wide: [.04, 0, .27, .13], phone: [.45, 0, .75, .15] },
    { kind: 'leaves', wide: [.015, .07, .07, .35], phone: [.015, .015, .09, .23] },
    { kind: 'dust', wide: [.20, .55, .34, .66], phone: [.28, .52, .47, .65] },
  ],
  tr_dolma: [
    { kind: 'breeze', wide: [.01, 0, .19, .16], phone: [.89, .025, .99, .24] },
    { kind: 'leaves', wide: [.035, .03, .16, .28], phone: [.89, .025, .99, .24] },
  ],
  tr_breakfast: [
    { kind: 'breeze', wide: [.48, 0, .72, .17], phone: [.60, 0, .90, .17] },
    { kind: 'leaves', wide: [.52, .01, .69, .20], phone: [.61, .012, .79, .20] },
  ],
  tr_meze: [
    { kind: 'light', wide: [.063, .01, .156, .15], phone: [.40, .005, .60, .13] },
    { kind: 'light', wide: [.466, .09, .553, .20], phone: [.55, .08, .66, .16] },
    { kind: 'breeze', wide: [.14, 0, .38, .13], phone: [.72, .01, .97, .14] },
    { kind: 'water', wide: [.225, .184, .29, .206], phone: [.80, .312, .93, .326], color: '#f4c68a' },
  ],
  tr_olive: [
    { kind: 'breeze', wide: [.015, .035, .26, .32], phone: [.44, .02, .90, .23] },
    { kind: 'leaves', wide: [.01, .03, .16, .35], phone: [.47, .015, .67, .27], color: '#acb078' },
  ],
  tr_tea_hill: [
    { kind: 'breeze', wide: [.32, .81, .56, 1], phone: [.34, .79, .82, .98] },
    { kind: 'breeze', wide: [.01, 0, .25, .11], phone: [.01, 0, .19, .22] },
    { kind: 'water', wide: [.865, .257, .975, .279], phone: [.88, .215, .985, .244] },
    { kind: 'leaves', wide: [.01, .04, .08, .24], phone: [.08, .065, .16, .25] },
    { kind: 'mist', wide: [.30, .10, .79, .38], phone: [.22, .15, .76, .39] },
  ],
  tr_supper: [
    { kind: 'breeze', wide: [.01, 0, .16, .14], phone: [.77, .015, .97, .22] },
    { kind: 'leaves', wide: [.01, .025, .11, .27], phone: [.77, .015, .91, .24] },
  ],
};
