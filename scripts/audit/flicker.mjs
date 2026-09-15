/** Lists horizontal faces near a world point grouped by height, and exact coplanar overlaps, to find z-fighting.
 *  Run: node scripts/audit/flicker.mjs <world-module> <build-fn> <x> <z> <radius>   e.g. world-mideast buildMideast -20 -26 12 */
import { mkdtemp, rm } from 'node:fs/promises'; import { tmpdir } from 'node:os'; import { join } from 'node:path'; import { pathToFileURL } from 'node:url';
import { build } from 'rolldown'; import * as THREE from 'three'; import { coplanarOverlaps } from '../tests/coplanar-surfaces.mjs';
const [mod, fn, X, Z, R] = process.argv.slice(2); const cx = Number(X), cz = Number(Z), r = Number(R ?? 10);
const ctx = new Proxy({}, { get: (_, key) => key === 'createLinearGradient' || key === 'createRadialGradient' ? () => ({ addColorStop() {} }) : key === 'measureText' ? () => ({ width: 20 }) : () => {}, set: () => true });
globalThis.document = { visibilityState: 'hidden', defaultView: { Element: class {} }, createElement: () => ({ ownerDocument: document, getContext: () => ctx, style: {}, setAttribute() {}, classList: { add() {}, remove() {}, toggle() {} }, addEventListener() {} }) };
globalThis.Image = class { complete = true; naturalWidth = 24; naturalHeight = 14; set src(_) {} };
const temp = await mkdtemp(join(tmpdir(), 'flicker-'));
try {
  await build({ input: { world: `src/fw/${mod}.ts` }, platform: 'node', output: { banner: 'import.meta.env = { VITE_STATIC: "1", BASE_URL: "/" };', dir: temp, format: 'esm', entryFileNames: '[name].mjs', chunkFileNames: '[name].mjs' } });
  const world = await import(pathToFileURL(join(temp, 'world.mjs')));
  const d = world[fn]([]); d.group.updateMatrixWorld(true);
  const near = []; const box = new THREE.Box3();
  d.group.traverse((o) => { if (!o.isMesh) return; box.setFromObject(o); const c = box.getCenter(new THREE.Vector3()); if (Math.hypot(c.x - cx, c.z - cz) - Math.max(box.max.x - box.min.x, box.max.z - box.min.z) / 2 <= r) near.push(o); });
  const rows = new Map();
  for (const m of near) {
    const g = m.geometry, idx = g.index, pos = g.attributes.position; if (!pos) continue;
    const n = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let i = 0; i < (idx ? idx.count : pos.count); i += 3) {
      const j = (k) => idx ? idx.getX(i + k) : i + k;
      a.fromBufferAttribute(pos, j(0)).applyMatrix4(m.matrixWorld); b.fromBufferAttribute(pos, j(1)).applyMatrix4(m.matrixWorld); c.fromBufferAttribute(pos, j(2)).applyMatrix4(m.matrixWorld);
      n.subVectors(b, a).cross(c.clone().sub(a)); if (n.length() < 1e-9) continue; n.normalize();
      if (Math.abs(n.y) < .98) continue;
      const y = Math.round(((a.y + b.y + c.y) / 3) * 1000) / 1000, up = n.y > 0 ? 'up' : 'down';
      const name = m.name || m.parent?.name || m.parent?.parent?.name || '?', color = m.material?.color ? '#' + m.material.color.getHexString() : (m.material?.map ? 'textured' : '?');
      const key = `${y}|${up}|${name}|${color}`; const e = rows.get(key) ?? { y, up, name, color, tris: 0, minx: 1e9, maxx: -1e9, minz: 1e9, maxz: -1e9};
      e.tris++; for (const v of [a, b, c]) { e.minx = Math.min(e.minx, v.x); e.maxx = Math.max(e.maxx, v.x); e.minz = Math.min(e.minz, v.z); e.maxz = Math.max(e.maxz, v.z); }
      rows.set(key, e);
    }
  }
  const list = [...rows.values()].filter(e => e.up === 'up').sort((p, q) => p.y - q.y);
  console.log(`meshes near (${cx},${cz}) r=${r}: ${near.length}`);
  for (const e of list) if (e.y < 8) console.log(`y=${e.y.toFixed(3).padStart(7)} ${e.name.padEnd(24)} ${e.color.padEnd(9)} tris=${String(e.tris).padStart(4)} x[${e.minx.toFixed(1)}..${e.maxx.toFixed(1)}] z[${e.minz.toFixed(1)}..${e.maxz.toFixed(1)}]`);
  const g = new THREE.Group(); for (const m of near) { const clone = new THREE.Mesh(m.geometry, m.material); clone.matrixAutoUpdate = false; clone.matrix.copy(m.matrixWorld); clone.matrixWorld.copy(m.matrixWorld); g.add(clone); }
  const overlaps = coplanarOverlaps(g);
  console.log('exact coplanar overlaps:', overlaps.length); for (const o of overlaps.slice(0, 8)) console.log('  ', JSON.stringify(o).slice(0, 200));
} finally { await rm(temp, { recursive: true, force: true }); }
