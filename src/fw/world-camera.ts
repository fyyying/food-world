/** Keep villages readable while retaining the composed full-region view on desktop. */
export function worldZoomLimit(world: string, width: number, height: number) {
  const phone = width < height || width < 720;
  return world === 'middle-east' && !phone ? 215 : 90;
}
