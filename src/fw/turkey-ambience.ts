import type { AmbientPatch } from './scene-ambience';

// Separate compositions: crisp leaves, sky and water motion; no duplicate painting layers.
// Each room has a visible, continuously animated feature in both orientations.
export const TURKEY_AMBIENCE: Record<string, AmbientPatch[]> = {
  tr_simit: [
    { kind: 'leaves', wide: [.53, .01, .69, .34], phone: [.39, .02, .73, .34] },
    { kind: 'water', wide: [.710, .357, .758, .378], phone: [.735, .348, .875, .358] },
  ],
  tr_tea: [
    { kind: 'light', wide: [.105, .11, .16, .23], phone: [.21, .065, .34, .17] },
    { kind: 'leaves', wide: [.04, .02, .20, .48], phone: [.12, .025, .36, .36] },
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
    { kind: 'leaves', wide: [.35, .02, .51, .35], phone: [.40, .012, .68, .32] },
  ],
  tr_fish: [
    { kind: 'water', wide: [.726, .386, .835, .409], phone: [.645, .283, .819, .324], color: '#f8dda0' },
    { kind: 'water', wide: [.852, .365, .919, .405], color: '#f8dda0' },
    { kind: 'light', wide: [.004, .235, .045, .32], phone: [.003, .20, .065, .28] },
  ],
  tr_kebab: [
    { kind: 'dust', wide: [.10, .54, .24, .61], phone: [.18, .55, .33, .62] },
  ],
  tr_baklava: [
    { kind: 'light', wide: [.539, .012, .599, .145] },
    { kind: 'dust', wide: [.24, .52, .43, .69], phone: [.27, .45, .56, .60] },
  ],
  tr_pide: [
    { kind: 'dust', wide: [.17, .47, .33, .62], phone: [.22, .44, .45, .60] },
  ],
  tr_yufka: [
    { kind: 'leaves', wide: [.015, .03, .18, .36], phone: [.43, .015, .73, .33] },
    { kind: 'dust', wide: [.20, .55, .34, .66], phone: [.28, .52, .47, .65] },
  ],
  tr_dolma: [
    { kind: 'leaves', wide: [.035, .03, .20, .37], phone: [.82, .025, .99, .36] },
  ],
  tr_breakfast: [
    { kind: 'leaves', wide: [.52, .01, .72, .32], phone: [.57, .012, .84, .32] },
  ],
  tr_meze: [
    { kind: 'light', wide: [.063, .01, .156, .15], phone: [.40, .005, .60, .13] },
    { kind: 'light', wide: [.466, .09, .553, .20], phone: [.55, .08, .66, .16] },
    { kind: 'leaves', wide: [.13, .015, .42, .32], phone: [.65, .025, .96, .36] },
    { kind: 'birds', wide: [.26, .04, .43, .14], phone: [.78, .135, .99, .19] },
    { kind: 'water', wide: [.225, .184, .29, .206], phone: [.80, .312, .93, .326], color: '#f4c68a' },
  ],
  tr_olive: [
    { kind: 'leaves', wide: [.37, .04, .59, .52], phone: [.50, .03, .82, .37], leaf: 'olive', color: '#82945e' },
    { kind: 'water', wide: [.48, .26, .61, .30], phone: [.87, .184, .99, .222] },
    { kind: 'water', wide: [.55, .30, .61, .34], phone: [.64, .265, .80, .281] },
    { kind: 'birds', wide: [.47, .15, .64, .22], phone: [.72, .12, .98, .17] },
    { kind: 'oil', phone: [.911, .503, .925, .529] },
    { kind: 'oil', phone: [.884, .541, .914, .573] },
  ],
  tr_tea_hill: [
    { kind: 'water', wide: [.865, .257, .975, .279], phone: [.88, .215, .985, .244] },
    { kind: 'leaves', wide: [.015, .035, .21, .34], phone: [.11, .035, .39, .34], leaf: 'olive', color: '#6d874a' },
    { kind: 'mist', wide: [.30, .10, .79, .38], phone: [.22, .15, .76, .39] },
  ],
  tr_supper: [
    { kind: 'leaves', wide: [.01, .025, .17, .37], phone: [.72, .015, .95, .36] },
  ],
};
