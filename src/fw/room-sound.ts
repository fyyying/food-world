/** Short, quiet, gesture-triggered sounds. No downloads or background loops. */
export type RoomSound = 'purr' | 'woof' | 'flour' | 'sizzle' | 'tea' | 'water' | 'leaves' | 'chime' | 'broth';
const seconds: Record<RoomSound, number> = { purr: 2.6, woof: .7, flour: .65, sizzle: 2.2, tea: 1.7, water: 1.2, leaves: 1.3, chime: 2, broth: 2.6 };

// Pure synthesis keeps the sample envelope and output level testable.
export function roomSoundSamples(kind: RoomSound, rate: number, random = Math.random): Float32Array {
  const length = seconds[kind], samples = new Float32Array(Math.ceil(length * rate));
  const tau = Math.PI * 2;
  const bubbleStarts = kind === 'water' ? [.02, .16, .42] : [.02, .19, .36, .65, .83, 1.14, 1.32, 1.58, 1.91, 2.15, 2.36];
  let low = 0, phase = 0;
  const pulse = (t: number, start: number, decay: number) => t < start ? 0 : (1 - Math.exp(-(t - start) * 350)) * Math.exp(-(t - start) * decay);
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate, noise = random() * 2 - 1;
    low += (noise - low) * (1 - Math.exp(-tau * 750 / rate));
    const edge = Math.min(1, t / .025, (length - t) / .1);
    let value = 0;
    if (kind === 'purr') {
      // A short voiced greeting followed by a purr. Keep audible harmonics
      // above the bass range rather than relying on 100 Hz on small speakers.
      const breath = .45 + .55 * Math.pow(Math.sin(Math.PI * t / 1.3), 2);
      const flutter = .3 + .7 * Math.pow(.5 + .5 * Math.sin(tau * 25 * t), 2);
      const greeting = t < .7 ? Math.pow(Math.sin(Math.PI * t / .7), 1.5) : 0;
      phase += tau * (440 + 180 * Math.sin(Math.PI * Math.min(t / .7, 1))) / rate;
      const voice = .12 * Math.sin(phase) + .055 * Math.sin(2 * phase) + .025 * Math.sin(3 * phase);
      const rumble = .055 * Math.sin(tau * 100 * t) + .11 * Math.sin(tau * 300 * t) + .075 * Math.sin(tau * 600 * t) + .04 * low;
      value = voice * greeting + rumble * breath * flutter * (1 - .6 * greeting);
    } else if (kind === 'woof') {
      phase += tau * (160 - 65 * Math.min(1, t / .24)) / rate;
      const voice = Math.sin(phase) + .45 * Math.sin(phase * 2) + .22 * Math.sin(phase * 3);
      value = (.08 * voice + .10 * low) * pulse(t, .025, 15);
    } else if (kind === 'flour') {
      const pat = pulse(t, .025, 28) + .65 * pulse(t, .25, 32);
      value = (.15 * low + .12 * Math.sin(tau * 115 * t)) * pat + .025 * noise * pulse(t, .045, 10);
    } else if (kind === 'sizzle') {
      const crackle = Math.pow(Math.max(0, Math.sin(t * 79) * Math.sin(t * 43)), 12);
      value = (noise - low) * (.026 + .10 * crackle) * Math.sin(Math.PI * t / length);
    } else if (kind === 'tea' || kind === 'leaves') {
      value = (kind === 'tea' ? noise - low : low) * .045 * Math.pow(Math.sin(Math.PI * t / length), 2) * (.65 + .35 * Math.sin(t * 19));
    } else if (kind === 'water' || kind === 'broth') {
      // Discrete falling-pitch bubbles, with irregular spacing and size.
      for (const [j, start] of bubbleStarts.entries()) {
        const age = t - start;
        if (age >= 0 && age < .3) {
          const f = 260 + (j * 137) % 420;
          value += .1 * pulse(t, start, 22) * Math.sin(tau * (f * age - 260 * age * age));
        }
      }
      value += .012 * low * Math.sin(Math.PI * t / length);
    } else {
      value = [660, 990, 1320].reduce((sum, f, j) => sum + .035 / (j + 1) * Math.sin(tau * f * t) * Math.exp(-t * (2.3 + j)), 0);
    }
    samples[i] = Math.max(-.3, Math.min(.3, value * edge));
  }
  return samples;
}

let activeStop: (() => void) | undefined;
/** One voice at a time. Exit/repeat cancels even a pending browser audio unlock. */
export function playRoomSound(kind: RoomSound): () => void {
  activeStop?.();
  if (typeof AudioContext === 'undefined') return () => {};
  let context: AudioContext | undefined, source: AudioBufferSourceNode | undefined;
  let restoreSession = () => {};
  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    if (activeStop === stop) activeStop = undefined;
    if (source) {
      source.onended = null;
      try { source.stop(); } catch { /* Playback may have failed before start. */ }
      source.disconnect();
    }
    if (context && context.state !== 'closed') void context.close().catch(() => {});
    restoreSession();
  };
  try {
    // iOS defaults Web Audio to ambient, which the ringer switch can mute.
    // Select media playback only for the requested sound, then release it.
    try {
      const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
      if (session) {
        const previous = session.type;
        session.type = 'playback';
        restoreSession = () => {
          try { if (session.type === 'playback') session.type = previous; } catch { /* Optional API. */ }
        };
      }
    } catch { /* Browsers without Audio Session still use normal Web Audio. */ }
    context = new AudioContext();
    activeStop = stop;
    const ctx = context;
    void ctx.resume().then(() => {
      if (stopped) return;
      const samples = roomSoundSamples(kind, ctx.sampleRate);
      const buffer = ctx.createBuffer(1, samples.length, ctx.sampleRate);
      buffer.getChannelData(0).set(samples);
      source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = stop;
      source.start();
    }).catch(stop);
  } catch { stop(); }
  return stop;
}
