/** Continuous, painting-aligned motion. Coordinates belong to each supplied composition. */
export type PaintingRect = [left: number, top: number, right: number, bottom: number];
export type AmbientPatch = {
  kind: 'water' | 'leaves' | 'birds' | 'oil' | 'dust' | 'rain' | 'mist' | 'light';
  wide?: PaintingRect;
  phone?: PaintingRect;
  color?: string;
  leaf?: 'olive';
};
type AmbientArt = {
  leaves: HTMLImageElement[];
};

/** Match scene.ts's portrait-image expansion, including portrait tablets. */
export function paintingFrame(portrait: boolean, visibleWidth: number) {
  if (!portrait) return { x: -8, y: -5, width: 1616, height: 910 };
  // SVG uses xMidYMid slice: wider portrait tablets crop the top and bottom, rather than stretch.
  const aspect = 941 / 1672, width = Math.max(910 * aspect, visibleWidth), height = width / aspect;
  return { x: (1600 - width) / 2, y: -5 + (910 - height) / 2, width, height };
}
const fraction = (n: number) => n - Math.floor(n);

/** Moving elements have their own silhouettes; never slide a duplicate of the painting over itself. */
export function ambientPainter(patches: AmbientPatch[]) {
  const leaves = patches.some(p => p.kind === 'leaves' && !p.leaf) ? [2, 3, 5, 6, 7].map(i => {
    const image = new Image(); image.src = `${import.meta.env.BASE_URL}scenes/hotpot/leaf-${i}.png`; return image;
  }) : [];
  return (ctx: CanvasRenderingContext2D, t: number, portrait: boolean) => drawAmbience(ctx, t, portrait, patches, { leaves });
}

export function drawAmbience(ctx: CanvasRenderingContext2D, t: number, portrait: boolean, patches: AmbientPatch[],
  art?: AmbientArt) {
  if (!patches.length) return;
  const frame = paintingFrame(portrait, ctx.canvas.width / ctx.getTransform().a);
  for (const [index, patch] of patches.entries()) {
    const r = portrait ? patch.phone : patch.wide;
    if (!r) continue;
    const x = frame.x + r[0] * frame.width, y = frame.y + r[1] * frame.height;
    const w = (r[2] - r[0]) * frame.width, h = (r[3] - r[1]) * frame.height;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (patch.kind === 'light') {
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
    } else if (patch.kind === 'oil') {
      // The portrait press has two visible golden streams. Highlights travel down each ribbon.
      ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        const px = x + w * (.38 + i * .12), flow = fraction(t * 1.7 + i * .31);
        ctx.strokeStyle = i === 1 ? '#fff0a1' : '#b89524';
        ctx.lineWidth = Math.max(1, w * .16); ctx.globalAlpha = .75;
        ctx.beginPath(); ctx.moveTo(px, y); ctx.quadraticCurveTo(px + Math.sin(t * 2 + i) * .6, y + h * .5, px - .5, y + h); ctx.stroke();
        ctx.strokeStyle = '#fff7ba'; ctx.globalAlpha = .8 * Math.sin(flow * Math.PI);
        ctx.beginPath(); ctx.moveTo(px, y + h * flow); ctx.lineTo(px, y + h * Math.min(1, flow + .14)); ctx.stroke();
      }
    } else if (patch.kind === 'leaves') {
      for (let i = 0; i < 4; i++) {
        // Already in flight on entry. Different speeds and flutter phases prevent a repeated curtain.
        const phase = fraction(t / (7.5 + i * 1.7) + i * .271 + .13);
        const flutter = Math.sin(t * (1.3 + i * .17) + i * 2.3);
        const px = x + w * (.24 + i * .16 + flutter * .12 + (phase - .5) * .12);
        const py = y + h * (.04 + phase * .92);
        const size = (portrait ? 25 : 35) * (.78 + i * .12);
        ctx.save(); ctx.translate(px, py); ctx.rotate(i + t * (i % 2 ? .65 : -.48) + flutter * .55);
        ctx.scale(.28 + .72 * Math.abs(Math.cos(t * .95 + i)), 1);
        ctx.globalAlpha = .94 * Math.min(1, phase * 9, (1 - phase) * 9);
        const image = art?.leaves[i % art.leaves.length];
        if (!patch.leaf && image?.complete && image.naturalWidth) {
          const leafWidth = size * image.naturalWidth / image.naturalHeight;
          ctx.drawImage(image, -leafWidth / 2, -size / 2, leafWidth, size);
        } else {
          // Narrow, silver-backed olive leaves rather than autumn foliage in the evergreen grove.
          const width = size * (patch.leaf === 'olive' ? .20 : .35);
          const shade = ctx.createLinearGradient(-width, 0, width, 0);
          shade.addColorStop(0, patch.color ?? '#7c873f'); shade.addColorStop(.5, '#d0ce92'); shade.addColorStop(1, '#657b45');
          ctx.fillStyle = shade; ctx.beginPath(); ctx.moveTo(0, -size / 2);
          ctx.quadraticCurveTo(width, 0, 0, size / 2); ctx.quadraticCurveTo(-width, 0, 0, -size / 2); ctx.fill();
          ctx.strokeStyle = '#ddd7ac'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(0, -size * .37); ctx.lineTo(0, size * .38); ctx.stroke();
        }
        ctx.restore();
      }
    } else if (patch.kind === 'birds') {
      // Small distant silhouettes cross the open sky, with a pause between each pair.
      for (let i = 0; i < 2; i++) {
        const phase = fraction((t + 2 - i * 1.5) / 23) * 3;
        if (phase > 1) continue;
        const span = (portrait ? 8 : 11) * (i ? .7 : 1);
        ctx.save(); ctx.translate(x + w * (.08 + phase * .84), y + h * (.45 + i * .22) + Math.sin(t * 1.4 + i) * 3);
        ctx.globalAlpha = .72 * Math.min(1, phase * 8, (1 - phase) * 8);
        ctx.strokeStyle = '#4d5147'; ctx.lineWidth = portrait ? 1.4 : 1.8; ctx.lineCap = 'round';
        const wing = -span * (.3 + Math.sin(t * 5 + i) * .6);
        ctx.beginPath(); ctx.moveTo(-span, wing); ctx.quadraticCurveTo(-span * .4, -span * .25, 0, 1);
        ctx.quadraticCurveTo(span * .4, -span * .25, span, wing); ctx.stroke(); ctx.restore();
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
