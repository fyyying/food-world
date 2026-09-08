/** Dev-only movement audit: steps a diorama's simulation without rendering and reports movers that end up in water, inside solid meshes, or on top of each other. */
import * as THREE from "three";
import type { Diorama } from "./worldkit";

export type Violation = { kind: "water" | "land" | "wall" | "overlap"; who: string; other?: string; at: [number, number]; n: number };

const isWater = (m: THREE.Mesh) => { const mat = m.material as THREE.ShaderMaterial; return Boolean(mat && (mat as THREE.ShaderMaterial).uniforms && (mat as THREE.ShaderMaterial).uniforms.uTime); };
const isInvisible = (m: THREE.Mesh) => { const mat = m.material as THREE.Material; return m.visible === false || mat.visible === false || (mat.transparent && mat.opacity < 0.15); };

export function auditDiorama(d: Diorama, seconds = 30, hz = 2): { movers: string[]; violations: Violation[] } {
  const root = d.group;
  let t = 1000 + Math.random() * 100;
  const advance = (frames: number) => { for (let i = 0; i < frames; i++) { t += 1 / 60; d.tick(t, 1 / 60); } root.updateMatrixWorld(true); };
  root.updateMatrixWorld(true);
  const before = new Map<THREE.Object3D, THREE.Vector3>();
  root.traverse((o) => before.set(o, o.position.clone()));
  advance(45);
  const moved = new Set<THREE.Object3D>();
  root.traverse((o) => { const b = before.get(o); if (b && Math.hypot(b.x - o.position.x, b.z - o.position.z) > 0.02) moved.add(o); });
  const movers = [...moved].filter((m) => { let p = m.parent; while (p) { if (moved.has(p)) return false; p = p.parent; } return true; }).filter((m) => { const b = new THREE.Box3().setFromObject(m); const s = b.getSize(new THREE.Vector3()); return b.min.y < 1.2 && s.y > 0.3 && Math.max(s.x, s.z) > 0.3 && Math.max(s.x, s.z) < 12; });
  const underMover = (o: THREE.Object3D) => { let p: THREE.Object3D | null = o; while (p) { if (movers.includes(p)) return true; p = p.parent; } return false; };
  const placedOf = (o: THREE.Object3D) => { let p: THREE.Object3D | null = o; while (p) { const pl = d.placed.find((x) => x.group === p); if (pl) return pl.obj.id; p = p.parent; } return ""; };
  const colorOf = (o: THREE.Object3D) => { let c = ""; o.traverse((m) => { if (!c && (m as THREE.Mesh).isMesh) { const mat = (m as THREE.Mesh).material as THREE.MeshStandardMaterial; if (mat.color) c = "#" + mat.color.getHexString(); } }); return c; };
  const nameOf = (o: THREE.Object3D) => { const b = new THREE.Box3().setFromObject(o); const s = b.getSize(new THREE.Vector3()); const c = b.getCenter(new THREE.Vector3()); return `${placedOf(o) || "layout"}:${o.name || colorOf(o)} ${s.x.toFixed(1)}x${s.y.toFixed(1)}x${s.z.toFixed(1)} @${c.x.toFixed(1)},${c.z.toFixed(1)}`; };
  const names = movers.map(nameOf);
  // statics
  const water: THREE.Mesh[] = [], solids: { box: THREE.Box3; mesh: THREE.Mesh; big: boolean; name: string }[] = [], decks: THREE.Box3[] = [];
  root.traverse((o) => {
    const m = o as THREE.Mesh; if (!m.isMesh || underMover(m) || isInvisible(m)) return;
    if (isWater(m)) { water.push(m); return; }
    const box = new THREE.Box3().setFromObject(m); const s = box.getSize(new THREE.Vector3());
    if (s.x > 40 || s.z > 40) return;                                      // ground, plinth
    if (box.min.y < 0.5 && box.max.y > 0.7 && s.x >= 0.25 && s.z >= 0.25) { const c = box.getCenter(new THREE.Vector3()); solids.push({ box, mesh: m, big: s.x > 5 || s.z > 5, name: `${placedOf(m) || "layout"}:${colorOf(m)} ${s.x.toFixed(1)}x${s.y.toFixed(1)}x${s.z.toFixed(1)}@${c.x.toFixed(1)},${c.z.toFixed(1)}` }); }
    else if (box.min.y >= 0.2 && box.min.y <= 1.2 && box.max.y - box.min.y < 1.0 && s.x > 1.5 && s.z > 1.0) decks.push(box);   // bridge decks, piers
  });
  const ray = new THREE.Raycaster(); const down = new THREE.Vector3(0, -1, 0);
  const hitsMesh = (mesh: THREE.Mesh, x: number, z: number) => { ray.set(new THREE.Vector3(x, 40, z), down); return ray.intersectObject(mesh, false).length > 0; };
  const inWater = (x: number, z: number) => { for (const w of water) if (hitsMesh(w, x, z)) return true; return false; };
  const onDeck = (x: number, z: number) => decks.some((b) => x >= b.min.x && x <= b.max.x && z >= b.min.z && z <= b.max.z);
  const tally = new Map<string, Violation>();
  const note = (kind: Violation["kind"], who: string, at: [number, number], other?: string) => { const key = `${kind}|${who}|${other ?? ""}`; const v = tally.get(key); if (v) v.n++; else tally.set(key, { kind, who, other, at, n: 1 }); };
  const wet: number[] = movers.map(() => 0), samples = Math.round(seconds * hz);
  const wetAt: [number, number][][] = movers.map(() => []), dryAt: [number, number][][] = movers.map(() => []);
  const walls: { i: number; at: [number, number]; name: string }[] = [];
  for (let k = 0; k < samples; k++) {
    advance(Math.round(60 / hz));
    const boxes = movers.map((m) => new THREE.Box3().setFromObject(m));
    movers.forEach((m, i) => {
      const b = boxes[i]; const bs = b.getSize(new THREE.Vector3()); if (b.min.y > 2.5 || bs.y < 0.3) return;
      const c = b.getCenter(new THREE.Vector3()); const x = c.x, z = c.z;
      const raw = inWater(x, z); if (raw) wet[i]++; if (raw && !onDeck(x, z)) wetAt[i].push([x, z]); if (!raw) dryAt[i].push([x, z]);
      for (const s of solids) { if (b.min.y > 0.35) break; if (s.mesh.parent && underMover(s.mesh)) continue; if (x < s.box.min.x + 0.15 || x > s.box.max.x - 0.15 || z < s.box.min.z + 0.15 || z > s.box.max.z - 0.15) continue; if (s.big && !hitsMesh(s.mesh, x, z)) continue; if (b.min.y > s.box.max.y - 0.2) continue; walls.push({ i, at: [x, z], name: s.name }); }
      for (let j = i + 1; j < movers.length; j++) { const o = boxes[j]; if (o.min.y > 2.5) continue; const ox = Math.min(b.max.x, o.max.x) - Math.max(b.min.x, o.min.x), oz = Math.min(b.max.z, o.max.z) - Math.max(b.min.z, o.min.z), oy = Math.min(b.max.y, o.max.y) - Math.max(b.min.y, o.min.y); if (ox > 0.35 && oz > 0.35 && oy > 0.3 && !(colorOf(movers[i]) === colorOf(movers[j]) && (movers[i].parent !== root || Math.max(bs.x, bs.z) > 2.5))) note("overlap", names[i], [x, z], names[j]); }
    });
  }
  const boats = movers.map((_, i) => wet[i] > samples * 0.6);
  movers.forEach((_, i) => { if (boats[i]) dryAt[i].forEach((p) => note("land", names[i], p)); else wetAt[i].forEach((p) => note("water", names[i], p)); });
  for (const w of walls) if (!boats[w.i]) note("wall", names[w.i], w.at, w.name);
  return { movers: names, violations: [...tally.values()].sort((a, b) => b.n - a.n) };
}
