import assert from 'node:assert/strict';
import { mkdtemp, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';

const temporary = await mkdtemp(join(tmpdir(), 'food-room-tests-'));
const originalRandom = Math.random;
try {
  await build({ input: 'src/fw/scenes-china.ts', platform: 'node', output: { file: join(temporary, 'rooms.mjs'), format: 'esm', banner: 'import.meta.env = { BASE_URL: "/" };' } });
  globalThis.Image = class { complete = false; naturalWidth = 0; };
  const { SCENES } = await import(pathToFileURL(join(temporary, 'rooms.mjs')));
  function render(factory, active, portrait) {
    let seed = 1, draws = 0;
    Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const scene = factory();
    const action = scene.hotspots.find(h => h.activeLabel);
    if (active) assert.equal(scene.react(action.id), true);
    const ctx = new Proxy({}, { get: (_, key) => key === 'createRadialGradient' ? () => ({ addColorStop() {} }) : () => { draws++; }, set: () => true });
    for (let i = 0; i < 120; i++) scene.fx(ctx, i / 60, 1 / 60, portrait);
    return draws;
  }
  for (const [id, factory] of Object.entries(SCENES)) {
    const room = factory();
    assert.ok(room.hotspots.length >= 1, `${id}: missing controls`);
    assert.ok(room.hotspots.every(h => !h.dock), `${id}: corner dock returned`);
    if (id === 'hotpot') {
      const action = room.hotspots.find(h => h.activeLabel);
      assert.equal(room.react(action.id), true);
      assert.equal(room.react(action.id), false);
      assert.equal(factory().react(action.id), true);
      for (const portrait of [false, true]) assert.ok(render(factory, true, portrait) > render(factory, false, portrait));
    } else {
      assert.ok(room.hotspots.length >= 2, `${id}: room-specific touch points`);
      for (const h of room.hotspots) {
        assert.ok(h.interaction && !h.prop && h.text);
        for (const point of [h.interaction.wide, h.interaction.phone]) assert.ok(point.every(n => n > 0 && n < 1));
        assert.ok(h.interaction.extent.every(n => n > 0 && n <= .5));
        await access(`public/scenes/${h.interaction.folder}/wide.jpg`);
        await access(`public/scenes/${h.interaction.folder}/portrait.jpg`);
      }
      assert.ok(room.layers.every(l => !l.svg.includes('/scenes/props/')), `${id}: no inserted furniture, animals or prop duplicates`);
    }
    for (const layer of room.layers) {
      for (const match of layer.svg.matchAll(/<image[^>]*href="([^"]+)"/g)) await access(join('public', match[1]));
    }
  }
  console.log(`PASS: ${Object.keys(SCENES).length} rooms: painted touch points, separate portrait anchors, no duplicate sprites, source images, and hotpot boil regression.`);
} finally {
  Math.random = originalRandom;
  await rm(temporary, { recursive: true, force: true });
}
