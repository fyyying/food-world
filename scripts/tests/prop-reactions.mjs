import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';
const temporary = await mkdtemp(join(tmpdir(), 'prop-reactions-'));
try {
  await build({ input: 'src/fw/scene-props.ts', platform: 'node', output: { file: join(temporary, 'props.mjs'), format: 'esm', banner: 'import.meta.env = { BASE_URL: "/" };' } });
  const { animateRoomTouch } = await import(pathToFileURL(join(temporary, 'props.mjs')));
  let reduced = false;
  globalThis.matchMedia = () => ({ matches: reduced });
  for (const motion of ['detail','water','leaves','flour','tea','sizzle','light','chime','purr','woof']) {
    const animations = [], particles = [];
    const animate = (frames, options) => {
      let finish;
      const a = { frames, options, cancelled: false, finished: new Promise(resolve => { finish = resolve; }), cancel() { this.cancelled = true; }, finish() { finish(); } };
      animations.push(a); return a;
    };
    globalThis.document = { createElement: tag => { assert.equal(tag, 'i', 'effects must not insert animal or object images'); return { style: {}, animate, removed: false, remove() { this.removed = true; } }; } };
    const host = { append: p => particles.push(p) };
    const interaction = { effect: motion };
    const classes = new Set();
    const trigger = { classList: { add: c => classes.add(c), remove: c => classes.delete(c) } };
    const cleanup = animateRoomTouch(host, interaction, trigger);
    assert.ok(animations.length > 0 && particles.length > 0, `${motion}: visible local feedback`);
    const denseCounts = {water: 15, leaves: 25, tea: 25, sizzle: 40};
    if (denseCounts[motion]) assert.equal(particles.length, denseCounts[motion], 'fivefold particle density');
    if (motion !== 'detail') assert.ok(classes.has('room-responding'), 'marker clears the effect');
    cleanup(); cleanup();
    assert.equal(classes.size, 0, 'marker restored on cancellation');
    assert.ok(animations.every(a => a.cancelled), `${motion}: scene exit cancels animations`);
    assert.ok(particles.every(p => p.removed), `${motion}: scene exit removes particles`);
    animations.length = 0; particles.length = 0;
    animateRoomTouch(host, interaction, trigger);
    animations.forEach(a => a.finish());
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.ok(animations.every(a => a.cancelled), `${motion}: natural completion clears animations`);
    assert.ok(particles.every(p => p.removed));
    assert.equal(classes.size, 0, 'marker restored on completion');
    reduced = true;
    animations.length = 0; particles.length = 0;
    animateRoomTouch(host, interaction, trigger)();
    assert.equal(particles.length, 1);
    assert.equal(animations[0].options.duration, 350);
    reduced = false;
  }
  console.log('PASS: ten local responses, stationary cat, repeat/exit cleanup, natural completion and reduced motion.');
} finally { await rm(temporary, {recursive: true, force: true}); }
