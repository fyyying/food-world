/** The UK re-lay (2026-09-24, docs/london-world.md "UK re-lay"): Britain takes the whole table and its six clusters
 *  are pulled apart so open, readable country lies between them, the way mountains part Sichuan from Xinjiang.
 *
 *  The clusters were laid by hand, stand by stand, road by road, against the ten-ray rule, the corridors and the
 *  water; inside a cluster every one of those relations is kept by moving the whole cluster as one rigid piece.
 *  Every British coordinate written in the old frame (the re-cluster pass of 2026-09-23: x -80.7 to -35.4, z -27.75
 *  to 27) goes through `W`, which is a translation per region:
 *
 *  - three rows, cut at z `S1` (the Firths and the Dales | Westminster and the Weald) and `S2` (| the West Country
 *    and the Docks), and each row cut into a west and an east column at `BX`;
 *  - the east column moves `DX` east, the middle row `DZ1` south and the south row `DZ1 + DZ2` south.
 *
 *  Each cut runs through the ground that already lay open between two clusters, so no stand, house, walker lane or
 *  doorstep is ever split, and a road or a river whose two vertices lie in different regions is simply drawn longer
 *  across the new country between them. The numbers were set so every pair of neighbouring clusters ends at least
 *  15.5 apart between their footprint hulls, above China's 14.97 between Sichuan and Xinjiang. */
import type { Pt } from './london-landscape';

export const UK_DX = 15.5, UK_DZ1 = 13.5, UK_DZ2 = 13.5;
/** The row cuts in the old frame: north of `S1` the Firths and the Dales, then Westminster and the Weald, and from
 *  `S2` south the West Country and the Docks. `S1` lies between the moor road (z -10.5) and the back of the public
 *  house (-9.0); `S2` between the river at Westminster (8.7) and the seamen's kitchen (9.0). */
export const UK_S1 = -9.8, UK_S2 = 8.85;
/** The column cut in a row, in the old frame. In the north row it steps round the Forth Bridge's east abutment
 *  (x -53.0) and the dale yard (x -55.4); in the middle row it lies between the tea room (-54.7) and the mushroom
 *  wood (-52.2); in the south row between the engine house (-57.4) and the coffee stall (-57.2). */
export function ukColumnCut(row: number, z: number): number {
  return row === 0 ? (z < -20 ? -52.8 : -56.0) : row === 1 ? -53.0 : -57.3;
}
export const ukRow = (z: number) => (z < UK_S1 ? 0 : z < UK_S2 ? 1 : 2);
/** An old-frame point into the UK table. `row` forces the row for the few points that stand in one row's band but
 *  belong to the next: the omnibus terminus behind the tea room and the dock warehouse's spots. */
/** The island's silhouette (lead QC of b0022fd, 2026-09-24): two clusters take a further move of their own so
 *  the coast can be shaped like Britain. The Firths go 10 north and 2 east, so Scotland stands out narrower above
 *  England; the West Country goes 8 west and 2 south, so Cornwall reaches out as a peninsula below the Bristol Channel. */
export const UK_EXTRA: Record<string, Pt> = { '0,0': [2, -10], '2,0': [-8, 2] };
/** Owner round, 2026-09-24 ("Tower Bridge is not in London"): London is one city on one river again. Westminster
 *  and the Docks take the same move, 13.5 south, so they stand exactly as the re-cluster pass laid them, the Docks
 *  just downstream of Westminster with the river, the bridge road and the quays between them as they were. The
 *  Weald goes east of London (31 east, 13.5 south) and the West Country further west (15 west, 31 south) to keep
 *  their distance from the Docks. The Firths and the Dales keep their moves. */
export const UK_REGION: Record<string, Pt> = {
  firths: [2, -10], dales: [UK_DX, 0], london: [0, UK_DZ1], weald: [31, UK_DZ1], westCountry: [-15, 31],
};
export function ukRegion(x: number, z: number, row?: number): string {
  const r = row ?? ukRow(z);
  if (r === 0) return x > ukColumnCut(0, z) ? 'dales' : 'firths';
  // the Weald's old ground: east of the middle row's cut, except the river's reach below the hop cookhouse
  if (r === 1 && x > -53 && !(x < -44 && z >= 6.3)) return 'weald';
  if (r === 2 && x <= -57.3) return 'westCountry';
  return 'london';
}
export function W(x: number, z: number, row?: number): Pt {
  const [ox, oz] = UK_REGION[ukRegion(x, z, row)];
  return [+(x + ox).toFixed(3), +(z + oz).toFixed(3)];
}
export const WP = (p: Pt, row?: number): Pt => W(p[0], p[1], row);
export const WPS = (pts: Pt[], row?: number): Pt[] => pts.map(p => W(p[0], p[1], row));
/** The offset a region moves by, for a mesh built whole in the old frame (the wet sand at the channel head). */
export function ukOffset(x: number, z: number): Pt { const [nx, nz] = W(x, z); return [nx - x, nz - z]; }
