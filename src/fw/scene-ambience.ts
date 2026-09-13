/** Continuous, painting-aligned motion. Coordinates belong to each supplied composition. */
export type PaintingRect = [left: number, top: number, right: number, bottom: number];
export type AmbientPatch = {
  kind: 'water' | 'leaves' | 'dust' | 'rain' | 'mist' | 'light' | 'breeze';
  wide?: PaintingRect;
  phone?: PaintingRect;
  color?: string;
};

/** Match scene.ts's portrait-image expansion, including portrait tablets. */
export function paintingFrame(portrait: boolean, visibleWidth: number) {
  if (!portrait) return { x: -8, y: -5, width: 1616, height: 910 };
  // SVG uses xMidYMid slice: wider portrait tablets crop the top and bottom, rather than stretch.
  const aspect = 941 / 1672, width = Math.max(910 * aspect, visibleWidth), height = width / aspect;
  return { x: (1600 - width) / 2, y: -5 + (910 - height) / 2, width, height };
}
const fraction = (n: number) => n - Math.floor(n);

/** Cache only the small foliage cutouts, with feathered edges, from the existing JPEG. */
export function ambientPainter(folder: string, patches: AmbientPatch[]) {
  const sources = new Map<boolean, HTMLImageElement>();
  const tiles = new Map<string, HTMLCanvasElement>();
  const tile = (portrait: boolean, index: number, r: PaintingRect) => {
    const key = `${portrait}-${index}`;
    if (tiles.has(key)) return tiles.get(key);
    let source = sources.get(portrait);
    if (!source) {
      source = new Image();
      source.src = `${import.meta.env.BASE_URL}scenes/${folder}/${portrait ? 'portrait' : 'wide'}.jpg`;
      sources.set(portrait, source);
    }
    if (!source.complete || !source.naturalWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil((r[2] - r[0]) * source.naturalWidth);
    canvas.height = Math.ceil((r[3] - r[1]) * source.naturalHeight);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(source, r[0] * source.naturalWidth, r[1] * source.naturalHeight,
      canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(canvas.width / 2, canvas.height / 2);
    const mask = ctx.createRadialGradient(0, 0, .45, 0, 0, 1);
    mask.addColorStop(0, '#fff'); mask.addColorStop(1, 'transparent');
    ctx.fillStyle = mask; ctx.fillRect(-1, -1, 2, 2);
    tiles.set(key, canvas);
    return canvas;
  };
  return (ctx: CanvasRenderingContext2D, t: number, portrait: boolean) => drawAmbience(ctx, t, portrait, patches, tile);
}

export function drawAmbience(ctx: CanvasRenderingContext2D, t: number, portrait: boolean, patches: AmbientPatch[],
  tile?: (portrait: boolean, index: number, rect: PaintingRect) => CanvasImageSource | undefined) {
  if (!patches.length) return;
  const frame = paintingFrame(portrait, ctx.canvas.width / ctx.getTransform().a);
  for (const [index, patch] of patches.entries()) {
    const r = portrait ? patch.phone : patch.wide;
    if (!r) continue;
    const x = frame.x + r[0] * frame.width, y = frame.y + r[1] * frame.height;
    const w = (r[2] - r[0]) * frame.width, h = (r[3] - r[1]) * frame.height;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (patch.kind === 'breeze') {
      const foliage = tile?.(portrait, index, r);
      // Move the painted leaves themselves, leaving people, masonry and the touch points fixed.
      const wind = Math.sin(t * 1.05 + index) + Math.sin(t * .43 + index) * .35;
      ctx.translate(x + w / 2 + wind * (portrait ? 2.5 : 4), y + h / 2 + Math.sin(t * .8 + index) * 1.3);
      ctx.rotate(wind * .008);
      if (foliage) ctx.drawImage(foliage, -w / 2, -h / 2, w, h);
    } else if (patch.kind === 'light') {
      // A slow, warm lamp shimmer, never a whole-image flash.
      const glow = .32 + Math.sin(t * 1.5 + index) * .10 + Math.sin(t * 3.7 + index * 2) * .035;
      ctx.translate(x + w / 2, y + h / 2); ctx.scale(w / 2, h / 2);
      const light = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      light.addColorStop(0, `rgba(255,225,158,${glow + .15})`);
      light.addColorStop(.28, `rgba(255,191,98,${glow})`);
      light.addColorStop(1, 'rgba(255,176,72,0)');
      ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = light;
      ctx.fillRect(-1, -1, 2, 2);
    } else if (patch.kind === 'water') {
      ctx.strokeStyle = patch.color ?? '#d4eee9'; ctx.lineWidth = portrait ? 1.6 : 1.4; ctx.lineCap = 'round';
      for (let i = 0; i < 18; i++) {
        const phase = t * .22 + i * .618 + index, fade = Math.sin(Math.PI * fraction(phase)) ** 2;
        const px = x + w * fraction(i * .371 + t * .026), py = y + h * fraction(i * .713) + Math.sin(t * 1.2 + i) * h * .07;
        const len = w * (.055 + (i % 4) * .018);
        ctx.globalAlpha = .66 * fade; ctx.beginPath();
        ctx.moveTo(px - len, py); ctx.quadraticCurveTo(px, py + Math.sin(t + i) * 1.8, px + len, py); ctx.stroke();
      }
    } else if (patch.kind === 'leaves') {
      for (let i = 0; i < 5; i++) {
        const phase = fraction(t / (9 + i * 1.5) + i * .373 + index * .21);
        const px = x + w * (.20 + i * .14 + Math.sin(t * .85 + i * 2) * .12), py = y + phase * h;
        ctx.save(); ctx.translate(px, py); ctx.rotate(Math.sin(t * 1.1 + i) * .8 + i);
        ctx.globalAlpha = .85 * Math.sin(Math.PI * phase) ** .6; ctx.fillStyle = patch.color ?? '#bda064';
        ctx.beginPath(); ctx.ellipse(0, 0, (portrait ? 4.5 : 6) * (.3 + Math.abs(Math.cos(t + i)) * .7), portrait ? 2 : 2.8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    } else if (patch.kind === 'rain') {
      ctx.strokeStyle = '#d3e2e1'; ctx.lineWidth = 1;
      for (let i = 0; i < 18; i++) {
        const phase = fraction(t * (.22 + i % 3 * .025) + i * .618);
        const px = x + w * fraction(i * .317 + .1), py = y + phase * h;
        ctx.globalAlpha = .55 * Math.sin(Math.PI * phase); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 1.5, py + 11); ctx.stroke();
      }
    } else if (patch.kind === 'mist') {
      for (let i = 0; i < 4; i++) {
        ctx.save();
        // Keep the whole soft bank inside its clip, avoiding a straight fog edge as it drifts.
        ctx.translate(x + w * (.25 + i * .16 + Math.sin(t * .25 + i) * .025), y + h * (.40 + i * .055 + Math.sin(t * .32 + i) * .07));
        ctx.scale(w * .22, h * .29);
        const fog = ctx.createRadialGradient(0, 0, .08, 0, 0, 1);
        fog.addColorStop(0, 'rgba(237,243,232,.30)'); fog.addColorStop(.45, 'rgba(237,243,232,.16)'); fog.addColorStop(1, 'rgba(237,243,232,0)');
        ctx.fillStyle = fog; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    } else {
      ctx.fillStyle = '#f3e6c9';
      for (let i = 0; i < 18; i++) {
        const phase = fraction(t * .16 + i * .618);
        const px = x + w * fraction(i * .371) + Math.sin(t + i) * 5, py = y + h * (1 - phase);
        ctx.globalAlpha = .62 * Math.sin(Math.PI * phase); ctx.beginPath(); ctx.arc(px, py, 1 + (i % 3) * .45, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }
}
