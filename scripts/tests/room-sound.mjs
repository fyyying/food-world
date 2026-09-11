import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';
const dir = await mkdtemp(join(tmpdir(), 'room-sound-'));
try {
  await build({ input: 'src/fw/room-sound.ts', platform: 'node', output: { file: join(dir, 'sound.mjs'), format: 'esm' } });
  const { roomSoundSamples, playRoomSound } = await import(pathToFileURL(join(dir, 'sound.mjs')));
  const signatures = new Set();
  for (const kind of ['purr','woof','flour','sizzle','tea','water','leaves','chime','broth']) {
    let seed = 42;
    const samples = roomSoundSamples(kind, 44100, () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32));
    let peak = 0, energy = 0;
    for (const sample of samples) { assert.ok(Number.isFinite(sample)); peak = Math.max(peak, Math.abs(sample)); energy += sample * sample; }
    assert.ok(samples.length / 44100 <= 3, `${kind}: finite, short sound`);
    assert.ok(peak > .01 && peak <= .3, `${kind}: audible level with headroom`);
    assert.ok(Math.sqrt(energy / samples.length) > .002, `${kind}: non-silent signal`);
    assert.ok(samples[0] === 0); assert.ok(Math.abs(samples.at(-1)) < .0001, 'no abrupt envelope edges');
    signatures.add(`${samples.length}:${energy.toFixed(6)}`);
  }
  assert.equal(signatures.size, 9, 'distinct sound profiles');
  const contexts = [];
  const session = { type: 'ambient' };
  Object.defineProperty(navigator, 'audioSession', { value: session, configurable: true });
  class FakeAudioContext {
    state = 'suspended'; sampleRate = 8000; destination = {}; sources = [];
    constructor() { this.sessionTypeAtStart = Object.getOwnPropertyDescriptor(navigator, 'audioSession')?.value?.type; contexts.push(this); }
    resume() { return new Promise((resolve, reject) => { this.unlock = () => { this.state = 'running'; resolve(); }; this.reject = reject; }); }
    createBuffer(_, length) { return { getChannelData: () => new Float32Array(length) }; }
    createBufferSource() { const source = { connect(){}, disconnect(){}, start(){ this.started = true; }, stop(){ this.stopped = true; } }; this.sources.push(source); return source; }
    close() { this.state = 'closed'; return Promise.resolve(); }
  }
  globalThis.AudioContext = FakeAudioContext;
  const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
  const cancel = playRoomSound('purr'); const pending = contexts.at(-1);
  assert.equal(pending.sessionTypeAtStart, 'playback', 'iPhone silent mode: choose media playback before creating Web Audio');
  cancel(); pending.unlock(); await flush();
  assert.equal(session.type, 'ambient', 'cancel restores the previous session mode');
  assert.equal(pending.sources.length, 0, 'exit before unlock cannot play late');
  const stopFirst = playRoomSound('flour'); const first = contexts.at(-1); first.unlock(); await flush();
  assert.ok(first.sources[0].started);
  const stopSecond = playRoomSound('woof'); const second = contexts.at(-1);
  assert.ok(first.sources[0].stopped); assert.equal(first.state, 'closed', 'new tap releases old voice');
  second.unlock(); await flush(); stopFirst();
  assert.equal(second.state, 'running', 'stale cleanup cannot cancel newer voice');
  second.sources[0].onended(); assert.equal(second.state, 'closed', 'completion releases audio resources');
  assert.equal(session.type, 'ambient', 'completion restores the previous session mode');
  stopSecond();
  playRoomSound('broth'); const rejected = contexts.at(-1); rejected.reject(new Error('blocked')); await flush();
  assert.equal(rejected.state, 'closed', 'browser audio rejection cleans up');
  delete navigator.audioSession;
  const stopWithoutSession = playRoomSound('chime');
  const unsupported = contexts.at(-1); unsupported.unlock(); await flush();
  assert.ok(unsupported.sources[0].started, 'browsers without Audio Session still play');
  stopWithoutSession();
  Object.defineProperty(navigator, 'audioSession', { get() { throw new Error('unavailable'); }, configurable: true });
  const stopDeniedSession = playRoomSound('chime');
  delete navigator.audioSession;
  const deniedSession = contexts.at(-1); deniedSession.unlock(); await flush();
  assert.ok(deniedSession.sources[0].started, 'Audio Session access failure must not prevent normal playback');
  stopDeniedSession();
  delete globalThis.AudioContext;
  playRoomSound('chime')();
  console.log('PASS: 9 finite sound profiles, gentle levels, envelopes, one voice, delayed unlock, exit and denied audio.');
} finally { await rm(dir, { recursive: true, force: true }); }
