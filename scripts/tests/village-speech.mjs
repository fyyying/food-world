import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';

const temporary = await mkdtemp(join(tmpdir(), 'village-speech-'));
try {
  await build({ input: 'src/fw/props.ts', platform: 'node', output: { file: join(temporary, 'props.mjs'), format: 'esm' } });
  let now = 0, timerId = 0;
  const timers = new Map(), appearances = [];
  Object.defineProperty(globalThis, 'performance', { value: { now: () => now }, configurable: true });
  globalThis.setTimeout = (fn, delay) => { timers.set(++timerId, { fn, at: now + delay }); return timerId; };
  globalThis.clearTimeout = id => timers.delete(id);
  class Element {
    style = {}; parentNode = null;
    ownerDocument = { defaultView: { Element } };
    classList = { add() {} };
    setAttribute() {}
    remove() {}
  }
  globalThis.document = { hidden: false, createElement() { appearances.push(now); return new Element(); } };
  const { ambientChat, bubble, group } = await import(pathToFileURL(join(temporary, 'props.mjs')));
  const houses = Array.from({ length: 60 }, () => {
    const house = group(), person = group(); person.userData.upper = group(); house.add(person);
    return { house, person, tick: ambientChat(house, ['Hello']) };
  });
  const bubbles = () => houses.flatMap(h => h.person.children.filter(o => o.isCSS2DObject));
  const step = () => {
    now += 100;
    for (const [id, timer] of timers) if (timer.at <= now) { timers.delete(id); timer.fn(); }
    houses.forEach(h => h.tick(0.1));
    assert.ok(bubbles().length <= 1, 'many houses never speak over each other');
  };
  for (let i = 0; i < 1200; i++) step();
  assert.ok(appearances.length >= 2 && appearances.length <= 7, 'occasional chatter over two minutes, regardless of house count');
  for (let i = 1; i < appearances.length; i++) assert.ok(appearances[i] - appearances[i - 1] >= 18000, 'long shared pause between background lines');
  bubble(houses[0].person, 'Tapped', 1);
  assert.equal(bubbles()[0].element.textContent, 'Tapped', 'a tap responds immediately');
  bubble(houses[1].person, 'Tapped again', 1);
  assert.equal(bubbles().length, 1, 'repeat taps replace rather than stack bubbles');
  assert.equal(bubbles()[0].element.textContent, 'Tapped again');
  const countAfterTap = appearances.length;
  for (let i = 0; i < 170; i++) step();
  assert.equal(appearances.length, countAfterTap, 'background chatter stays quiet after a tap');
  document.hidden = true;
  for (let i = 0; i < 600; i++) step();
  assert.equal(appearances.length, countAfterTap, 'hidden tabs do not start speech');
  assert.equal(bubbles().length, 0, 'speech cleans itself up');
  console.log('PASS: 60 houses share quiet intervals, one speaker, immediate tap priority, cleanup and hidden-tab silence.');
} finally { await rm(temporary, { recursive: true, force: true }); }
