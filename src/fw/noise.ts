/** Small deterministic helpers for procedural islands. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Smooth periodic wobble in [−1, 1] built from a few sines: cheap coastline noise. */
export function wobble(angle: number, seed: number): number {
  const r = mulberry32(seed);
  const a = r() * Math.PI * 2, b = r() * Math.PI * 2, c = r() * Math.PI * 2;
  return (Math.sin(angle * 2 + a) * 0.5 + Math.sin(angle * 3 + b) * 0.3 + Math.sin(angle * 5 + c) * 0.2);
}
