const PUBLISHED_WORLDS = new Set(['china', 'middle-east', 'mediterranean', 'italy', 'central-europe']);

/** Static sharing exposes only finished worlds; local development keeps the full workshop available. */
export function isWorldAvailable(world: string, staticBuild: boolean) {
  return !staticBuild || PUBLISHED_WORLDS.has(world);
}

/** Keep a trace of each sleeping world's palette while making its unavailable state unmistakable. */
export function unavailableMaterialHsl(h: number, s: number, l: number) {
  return {
    h,
    s: s <= 0.03 ? 0 : Math.min(0.10, Math.max(0.025, s * 0.14)),
    l: Math.min(0.72, Math.max(0.28, l * 0.72 + 0.22)),
  };
}
