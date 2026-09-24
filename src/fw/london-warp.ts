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
export function W(x: number, z: number, row?: number): Pt {
  const r = row ?? ukRow(z), east = x > ukColumnCut(r, z);
  return [+(x + (east ? UK_DX : 0)).toFixed(3), +(z + (r >= 1 ? UK_DZ1 : 0) + (r >= 2 ? UK_DZ2 : 0)).toFixed(3)];
}
export const WP = (p: Pt, row?: number): Pt => W(p[0], p[1], row);
export const WPS = (pts: Pt[], row?: number): Pt[] => pts.map(p => W(p[0], p[1], row));
/** The offset a region moves by, for a mesh built whole in the old frame (the wet sand at the channel head). */
export function ukOffset(x: number, z: number): Pt { const [nx, nz] = W(x, z); return [nx - x, nz - z]; }
