/** Slow lateral pace. Distances are in village units; time is seconds. */
export const CAMEL_SPEED = 0.26;
export const CAMEL_CYCLE = 3.2;
export const CAMEL_STANCE = 0.68;
export const CAMEL_LEG_LENGTH = 0.49;
export const CAMEL_HIP_HEIGHT = 0.95;
export const CAMEL_PAD_HEIGHT = 0.04;

export function camelFoot(t: number, side: number) {
  const phase = ((t / CAMEL_CYCLE + (side > 0 ? 0.5 : 0)) % 1 + 1) % 1;
  const stride = CAMEL_SPEED * CAMEL_CYCLE * CAMEL_STANCE;
  if (phase < CAMEL_STANCE) {
    // Relative motion cancels the body's forward travel while this foot bears weight.
    return { x: stride / 2 - phase * CAMEL_CYCLE * CAMEL_SPEED, y: CAMEL_PAD_HEIGHT, planted: true };
  }
  const u = (phase - CAMEL_STANCE) / (1 - CAMEL_STANCE);
  const ease = u * u * (3 - 2 * u);
  return { x: -stride / 2 + stride * ease, y: CAMEL_PAD_HEIGHT + Math.sin(Math.PI * u) ** 2 * 0.12, planted: false };
}

/** Two-segment leg reaches its foot target; front and rear joints bend in opposite directions. */
export function camelLeg(t: number, side: number, front: boolean) {
  const foot = camelFoot(t, side);
  const down = CAMEL_HIP_HEIGHT - foot.y;
  const reach = Math.min(2 * CAMEL_LEG_LENGTH - 0.0001, Math.hypot(foot.x, down));
  const bend = Math.acos(reach / (2 * CAMEL_LEG_LENGTH));
  const sign = front ? 1 : -1;
  const upper = Math.atan2(foot.x, down) + sign * bend;
  const lower = -sign * bend * 2;
  return { upper, lower, pad: -upper - lower };
}
