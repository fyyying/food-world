/** Keep villages readable while retaining the composed full-region view on desktop. */
export function worldZoomLimit(world: string, width: number, height: number) {
  const phone = width < height || width < 720;
  // The Middle East (124 wide), the Mediterranean (120 wide since Spain) and Southeast Asia (120 wide since
  // Thailand and Vietnam grew it) need the wide overview on desktop.
  return (world === 'middle-east' || world === 'mediterranean' || world === 'southeast-asia') && !phone ? 215 : 90;
}

/** The distance haze for a world, as [near, far] in world units.
 *
 *  The table has to stay readable at the world's own zoom-out limit. The far plane is therefore computed from
 *  the farthest thing the camera can see from there — the limit plus half the table's diagonal — times 1.6,
 *  which leaves that far corner in a light haze instead of flat in the paper colour. The near/far ratio of the
 *  original 90/200 pair is kept, so the haze builds the same way, and the colour stays the caller's paper.
 *
 *  A world whose limit is inside the old far plane keeps 90 and 200 exactly: China at its 90 limit, every other
 *  world and every phone view are unchanged. Only the three worlds that get the 215 desktop overview — the
 *  Mediterranean, the Middle East and Southeast Asia — get a computed pair. Before this, the Mediterranean used 90/200 with a 215
 *  limit, so at maximum zoom-out its whole table was past the far plane and rendered in the paper colour, with
 *  only the sea visible, because the water shader ignores fog.
 */
export function worldFogRange(world: string, width: number, height: number, halfDiagonal: number): [number, number] {
  const limit = worldZoomLimit(world, width, height);
  if (limit < 200) return [90, 200];
  const far = Math.round((limit + halfDiagonal) * 1.6);
  return [Math.round(far * 0.45), far];
}
