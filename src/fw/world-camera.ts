/** Keep phone villages at a readable scale; desktop can still survey the expanded Middle East. */
export function worldZoomLimit(world: string, width: number, height: number) {
  const phone = width < height || width < 720;
  return world === 'middle-east' && !phone ? 500 : 90;
}
