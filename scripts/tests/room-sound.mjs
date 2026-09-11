import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';
const dir = await mkdtemp(join(tmpdir(), 'room-sound-'));
try {
  await build({ input: 'src/fw/room-sound.ts', platform: 'node', output: { file: join(dir, 'sound.mjs'), format: 'esm', banner: 'import.meta.env = { BASE_URL: "/food-world/" };' } });
  const { roomSoundSamples, playRoomSound, preloadCatSound } = await import(pathToFileURL(join(dir, 'sound.mjs')));
  const signatures = new Set();
  for (const kind of ['woof','flour','sizzle','tea','water','leaves','chime','broth']) {
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
  assert.equal(signatures.size, 8, 'distinct sound profiles');
  const wav = await readFile('public/audio/cat-purr.wav');
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
  assert.equal(wav.readUInt16LE(22), 1, 'mono recording');
  const rate = wav.readUInt32LE(24), samples = (wav.length - 44) / 2;
  assert.ok(samples / rate > 2 && samples / rate < 3, 'brief recording, no loop');
  let energy = 0;
  const tones = [300, 600].map(f => ({ f, sin: 0, cos: 0 }));
  for (let i = 0; i < samples; i++) {
    const value = wav.readInt16LE(44 + i * 2) / 32768;
    assert.ok(Math.abs(value) <= .241, 'recording keeps volume headroom');
    energy += value * value;
    for (const tone of tones) {
      tone.sin += value * Math.sin(2 * Math.PI * tone.f * i / rate);
      tone.cos += value * Math.cos(2 * Math.PI * tone.f * i / rate);
    }
  }
  for (const tone of tones) assert.ok(2 * (tone.sin ** 2 + tone.cos ** 2) / (samples * energy) < .01, 'no sustained 300/600 Hz ringing in the cat recording');
  assert.ok(Math.sqrt(energy / samples) > .02, 'recording is not silent');
  const contexts = [];
  const session = { type: 'ambient' };
  Object.defineProperty(navigator, 'audioSession', { value: session, configurable: true });
  class FakeAudioContext {
    state = 'suspended'; sampleRate = 8000; destination = {}; sources = [];
    constructor() { this.sessionTypeAtStart = Object.getOwnPropertyDescriptor(navigator, 'audioSession')?.value?.type; contexts.push(this); }
    resume() { return new Promise((resolve, reject) => { this.unlock = () => { this.state = 'running'; resolve(); }; this.reject = reject; }); }
    decodeAudioData(bytes) { this.recording = bytes; return new Promise(resolve => { this.finishDecode = () => resolve({ recorded: true }); }); }
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
  let requests = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async url => {
    assert.equal(url, '/food-world/audio/cat-purr.wav', 'GitHub Pages asset base');
    requests++;
    return { ok: true, arrayBuffer: async () => wav.buffer.slice(wav.byteOffset, wav.byteOffset + wav.byteLength) };
  };
  await preloadCatSound();
  const stopCat = playRoomSound('purr');
  const cat = contexts.at(-1); cat.unlock(); await flush(); await flush();
  assert.ok(cat.recording.byteLength > 0, 'cat loads the real recording');
  stopCat(); cat.finishDecode(); await flush();
  assert.equal(cat.sources.length, 0, 'exit while decoding cannot play late');
  const stopNextCat = playRoomSound('purr');
  const nextCat = contexts.at(-1); nextCat.unlock(); await flush(); await flush();
  nextCat.finishDecode(); await flush();
  assert.ok(nextCat.sources[0].buffer.recorded, 'cat playback uses decoded audio, never synthetic tones');
  assert.equal(requests, 1, 'recording is cached for subsequent taps');
  stopNextCat();
  globalThis.fetch = originalFetch;
  delete globalThis.AudioContext;
  playRoomSound('chime')();
  console.log('PASS: real cat recording without fixed ringing tones, decode cancellation, caching, 8 synthesized sounds, gentle levels, envelopes, one voice, delayed unlock, exit and denied audio.');
} finally { await rm(dir, { recursive: true, force: true }); }
