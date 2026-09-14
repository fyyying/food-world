const PUBLISHED_WORLDS = new Set(['china', 'middle-east']);

/** Static sharing exposes only finished worlds; local development keeps the full workshop available. */
export function isWorldAvailable(world: string, staticBuild: boolean) {
  return !staticBuild || PUBLISHED_WORLDS.has(world);
}
