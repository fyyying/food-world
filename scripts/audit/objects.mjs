import { mkdtemp, rm } from 'node:fs/promises'; import { tmpdir } from 'node:os'; import { join } from 'node:path'; import { pathToFileURL } from 'node:url'; import { build } from 'rolldown';
const dir = await mkdtemp(join(tmpdir(), 'obj-'));
await build({ input: { g: 'src/fw/graph.ts' }, platform: 'node', output: { banner: 'import.meta.env = { VITE_STATIC: "1", BASE_URL: "/" };', dir, format: 'esm', entryFileNames: '[name].mjs', chunkFileNames: '[name].mjs' } });
const g = await import(pathToFileURL(join(dir, 'g.mjs')));
const byArea = {};
for (const o of g.ALL_OBJECTS) { if (!['china','middle-east'].includes(o.world)) continue; (byArea[o.area] ??= []).push(o); }
for (const [area, objs] of Object.entries(byArea)) {
  const rooms = objs.filter(o => o.scene), cards = objs.filter(o => !o.scene && !o.parent && !o.alias && !o.hitOnly), hit = objs.filter(o => !o.scene && (o.hitOnly || o.parent || o.alias));
  console.log(`\n${area}: rooms=${rooms.length} card-only-with-prop=${cards.length} hit/child=${hit.length}`);
  console.log('  card-only:', cards.map(o => `${o.id}(${o.kind}:${o.prop})`).join(', '));
}
await rm(dir, { recursive: true, force: true });
