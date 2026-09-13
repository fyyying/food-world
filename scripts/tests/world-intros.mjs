import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';

const temporary = await mkdtemp(join(tmpdir(), 'food-world-intros-'));
try {
  const output = join(temporary, 'world-intros.mjs');
  await build({ input: 'src/fw/world-intros.ts', platform: 'node', output: { file: output, format: 'esm' } });
  const { WORLD_INTROS } = await import(pathToFileURL(output));

  const worlds = [
    'china', 'italy', 'korea', 'mexico', 'middle-east', 'mediterranean',
    'india', 'southeast-asia', 'north-america', 'japan', 'central-europe',
  ];
  assert.deepEqual(Object.keys(WORLD_INTROS).sort(), worlds.sort(), 'every built world has an introduction');

  for (const [world, intro] of Object.entries(WORLD_INTROS)) {
    assert.ok(intro.summary.length >= 60 && intro.summary.length <= 180, `${world}: concise overview`);
    const expectedRange = world === 'china' ? [7, 9] : [3, 4];
    assert.ok(intro.beats.length >= expectedRange[0] && intro.beats.length <= expectedRange[1], `${world}: appropriate story depth`);
    for (const beat of intro.beats) {
      assert.ok(beat.eyebrow && beat.title && beat.body && beat.emoji, `${world}: complete story beat`);
      assert.ok(beat.body.length <= 420, `${world}: phone-friendly story beat`);
      assert.ok((beat.areas ?? []).length <= 4, `${world}: no crowded destination list`);
    }
  }

  const china = WORLD_INTROS.china;
  const chinaStory = `${china.summary} ${china.beats.map(beat => `${beat.title} ${beat.body}`).join(' ')}`;
  assert.match(chinaStory, /histor/i, 'China connects the present to food history');
  assert.match(chinaStory, /tea/i, 'China includes tea heritage');
  assert.match(chinaStory, /regional/i, 'China explains regional variety');
  assert.match(chinaStory, /today|modern/i, 'China reaches the present day');
  assert.ok(china.beats.flatMap(beat => beat.areas ?? []).includes('everyday'), 'China links the overview to the everyday table');
  assert.ok(china.beats.filter(beat => beat.sources?.length).length >= 6, 'China grounds historical and regional chapters in sources');

  console.log('PASS: all 11 worlds have concise, navigable storybook content; China covers history, tea, regional variety and food today.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
