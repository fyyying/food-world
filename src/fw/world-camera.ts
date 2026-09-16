/** Keep villages readable while retaining the composed full-region view on desktop. */
export function worldZoomLimit(world: string, width: number, height: number) {
  const phone = width < height || width < 720;
  // The Middle East (124 wide) and the Mediterranean (120 wide since Spain) need the wide overview on desktop.
  return (world === 'middle-east' || world === 'mediterranean') && !phone ? 215 : 90;
}
