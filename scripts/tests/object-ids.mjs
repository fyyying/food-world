/** Object ids are looked up globally (objectById); a duplicate across worlds sends a card link to the wrong world. */
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises'; import { tmpdir } from 'node:os'; import { join } from 'node:path'; import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';
const dir = await mkdtemp(join(tmpdir(), 'ids-'));
try {
  await build({ input: { g: 'src/fw/graph.ts' }, platform: 'node', output: { banner: 'import.meta.env = { VITE_STATIC: "1", BASE_URL: "/" };', dir, format: 'esm', entryFileNames: '[name].mjs', chunkFileNames: '[name].mjs' } });
  const { ALL_OBJECTS } = await import(pathToFileURL(join(dir, 'g.mjs')));
  const seen = new Map(), dupes = [];
  for (const o of ALL_OBJECTS) { if (seen.has(o.id)) dupes.push(`${o.id} (${seen.get(o.id)} and ${o.world})`); else seen.set(o.id, o.world); }
  assert.deepEqual(dupes, [], 'object ids must be unique across every world');
  for (const o of ALL_OBJECTS) {
    if (o.alias) assert.ok(seen.has(o.alias), `${o.id}: alias ${o.alias} names no object`);
    if (o.parent) assert.ok(seen.has(o.parent), `${o.id}: parent ${o.parent} names no object`);
  }
  console.log(`PASS: ${ALL_OBJECTS.length} objects, every id unique, every alias and parent resolves.`);
} finally { await rm(dir, { recursive: true, force: true }); }
