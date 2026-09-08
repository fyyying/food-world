// People for Living Scenes: proportioned, shaded illustration figures (not clay miniatures).
// Everything is absolute-coordinate SVG so a figure can face either way without sign tricks.
// `d` is the facing: 0 = towards the viewer, +1 = towards +x (right), −1 = towards −x (left).

export type Mood = "calm" | "smile" | "laugh";
export type Hair = "bob" | "short" | "bun" | "ponytail" | "toque" | "cropped";
export type Look = { skin: string; hair: string; style: Hair; mood: Mood; glasses?: boolean; lips?: string };

/** k < 0 darkens towards black, k > 0 lightens towards white */
export function mix(hex: string, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k);
  return `#${((f((n >> 16) & 255) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).padStart(6, "0")}`;
}

export function skinDefs(id: string, skin: string) {
  return `<radialGradient id="${id}-skin" cx=".38" cy=".28" r=".9"><stop offset="0" stop-color="${mix(skin, 0.1)}"/><stop offset=".7" stop-color="${skin}"/><stop offset="1" stop-color="${mix(skin, -0.24)}"/></radialGradient>`;
}
export function clothDefs(id: string, color: string) {
  return `<linearGradient id="${id}-cloth" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(color, 0.12)}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="${mix(color, -0.32)}"/></linearGradient>`;
}

/** A head, chin at cy+40, crown at about cy−54. Wrapped in a group with a pivot at the neck for nodding. */
export function head(id: string, cx: number, cy: number, d: number, look: Look): string {
  const skin = `url(#${id}-skin)`, dark = mix(look.skin, -0.3), hairHi = mix(look.hair, 0.28), hairLo = mix(look.hair, -0.25);
  const fx = cx + d * 8;   // features drift towards the facing side in three-quarter view
  const face = `M${cx - 31},${cy - 8} C${cx - 32},${cy - 50} ${cx + 32},${cy - 50} ${cx + 31},${cy - 8} C${cx + 30},${cy + 18} ${cx + 17},${cy + 40} ${cx},${cy + 40} C${cx - 17},${cy + 40} ${cx - 30},${cy + 18} ${cx - 31},${cy - 8} Z`;
  // hair: what sits behind the face, then what falls in front of it
  let hairBack = "", hairFront = "";
  switch (look.style) {
    case "bob":
      hairBack = `<path d="M${cx - 42},${cy - 16} C${cx - 46},${cy - 62} ${cx + 46},${cy - 62} ${cx + 42},${cy - 16} L${cx + 40},${cy + 30} Q${cx + 36},${cy + 44} ${cx + 22},${cy + 42} L${cx - 22},${cy + 42} Q${cx - 36},${cy + 44} ${cx - 40},${cy + 30} Z" fill="${look.hair}"/>`;
      hairFront = `<path d="M${cx - 33},${cy - 6} C${cx - 36},${cy - 46} ${cx - 14},${cy - 56} ${cx},${cy - 56} C${cx + 16},${cy - 56} ${cx + 36},${cy - 46} ${cx + 33},${cy - 6} C${cx + 29},${cy - 24} ${cx + 21},${cy - 32} ${cx + 8 + d * 6},${cy - 30} C${cx + 1},${cy - 22} ${cx - 5},${cy - 16} ${cx - 9 + d * 4},${cy - 26} C${cx - 18},${cy - 34} ${cx - 27},${cy - 26} ${cx - 33},${cy - 6} Z" fill="${look.hair}"/>
        <path d="M${cx - 22},${cy - 46} C${cx - 10},${cy - 54} ${cx + 10},${cy - 54} ${cx + 22},${cy - 46}" stroke="${hairHi}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>`;
      break;
    case "short":
      hairFront = `<path d="M${cx - 33},${cy - 4} C${cx - 37},${cy - 46} ${cx - 14},${cy - 58} ${cx + 2},${cy - 57} C${cx + 20},${cy - 57} ${cx + 37},${cy - 44} ${cx + 33},${cy - 8} C${cx + 30},${cy - 22} ${cx + 22},${cy - 31} ${cx + 10},${cy - 31} C${cx - 4},${cy - 31} ${cx - 10},${cy - 25} ${cx - 20},${cy - 27} C${cx - 28},${cy - 29} ${cx - 32},${cy - 18} ${cx - 33},${cy - 4} Z" fill="${look.hair}"/>
        <path d="M${cx - 33},${cy - 6} L${cx - 33},${cy + 8} Q${cx - 29},${cy + 10} ${cx - 27},${cy + 4} L${cx - 27},${cy - 14} Z M${cx + 33},${cy - 6} L${cx + 33},${cy + 8} Q${cx + 29},${cy + 10} ${cx + 27},${cy + 4} L${cx + 27},${cy - 14} Z" fill="${look.hair}"/>
        <path d="M${cx - 18},${cy - 48} C${cx - 6},${cy - 54} ${cx + 8},${cy - 54} ${cx + 20},${cy - 48}" stroke="${hairHi}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>`;
      break;
    case "bun":
      hairBack = `<circle cx="${cx - d * 12}" cy="${cy - 58}" r="16" fill="${hairLo}"/><circle cx="${cx - d * 12 - 4}" cy="${cy - 61}" r="10" fill="${look.hair}"/>`;
      hairFront = `<path d="M${cx - 33},${cy - 4} C${cx - 37},${cy - 48} ${cx - 14},${cy - 58} ${cx},${cy - 58} C${cx + 14},${cy - 58} ${cx + 37},${cy - 48} ${cx + 33},${cy - 4} C${cx + 27},${cy - 32} ${cx + 12},${cy - 40} ${cx},${cy - 40} C${cx - 12},${cy - 40} ${cx - 27},${cy - 32} ${cx - 33},${cy - 4} Z" fill="${look.hair}"/>
        <path d="M${cx + d * 4},${cy - 58} L${cx + d * 6},${cy - 40}" stroke="${hairLo}" stroke-width="2" opacity=".8"/>
        <path d="M${cx - 20},${cy - 46} C${cx - 8},${cy - 54} ${cx + 8},${cy - 54} ${cx + 20},${cy - 46}" stroke="${hairHi}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>`;
      break;
    case "ponytail":
      hairBack = `<path d="M${cx - d * 26},${cy - 30} C${cx - d * 48},${cy - 20} ${cx - d * 50},${cy + 10} ${cx - d * 40},${cy + 44} C${cx - d * 30},${cy + 30} ${cx - d * 30},${cy - 4} ${cx - d * 14},${cy - 30} Z" fill="${hairLo}"/>`;
      hairFront = `<path d="M${cx - 33},${cy - 4} C${cx - 37},${cy - 48} ${cx - 14},${cy - 58} ${cx},${cy - 58} C${cx + 14},${cy - 58} ${cx + 37},${cy - 48} ${cx + 33},${cy - 4} C${cx + 28},${cy - 26} ${cx + 16},${cy - 34} ${cx + 4 + d * 8},${cy - 34} C${cx - 8},${cy - 30} ${cx - 22},${cy - 30} ${cx - 33},${cy - 4} Z" fill="${look.hair}"/>
        <path d="M${cx - 20},${cy - 46} C${cx - 8},${cy - 54} ${cx + 8},${cy - 54} ${cx + 20},${cy - 46}" stroke="${hairHi}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>`;
      break;
    case "toque":
      hairFront = `<path d="M${cx - 30},${cy - 44} L${cx - 34},${cy - 100} C${cx - 20},${cy - 118} ${cx + 20},${cy - 118} ${cx + 34},${cy - 100} L${cx + 30},${cy - 44} Z" fill="#f7f4ee"/>
        <path d="M${cx + 10},${cy - 44} L${cx + 14},${cy - 102} C${cx + 22},${cy - 112} ${cx + 30},${cy - 108} ${cx + 34},${cy - 100} L${cx + 30},${cy - 44} Z" fill="#dcd6cc"/>
        <rect x="${cx - 32}" y="${cy - 50}" width="64" height="12" rx="3" fill="#ffffff"/><rect x="${cx - 32}" y="${cy - 40}" width="64" height="4" fill="#cfc8bc"/>
        <path d="M${cx - 31},${cy - 8} C${cx - 32},${cy - 34} ${cx - 14},${cy - 40} ${cx},${cy - 40} C${cx + 14},${cy - 40} ${cx + 32},${cy - 34} ${cx + 31},${cy - 8} L${cx + 31},${cy - 26} L${cx - 31},${cy - 26} Z" fill="${look.hair}"/>`;
      break;
    case "cropped":
      hairFront = `<path d="M${cx - 33},${cy - 6} C${cx - 36},${cy - 48} ${cx - 14},${cy - 57} ${cx},${cy - 57} C${cx + 14},${cy - 57} ${cx + 36},${cy - 48} ${cx + 33},${cy - 6} C${cx + 26},${cy - 28} ${cx + 10},${cy - 34} ${cx},${cy - 34} C${cx - 10},${cy - 34} ${cx - 26},${cy - 28} ${cx - 33},${cy - 6} Z" fill="${look.hair}"/>`;
      break;
  }
  // eyes, brows, nose, mouth
  const ey = cy - 6, near = fx + d * 14, far = fx - d * 14;
  const eye = (ex: number, w: number) =>
    look.mood === "laugh"
      ? `<path d="M${ex - w / 2},${ey + 2} q${w / 2},-9 ${w},0" stroke="#2d1c14" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
      : `<path d="M${ex - w / 2},${ey} q${w / 2},-7 ${w},0 q-${w / 2},7 -${w},0 Z" fill="#fff"/>
         <circle cx="${ex + d * 1.5}" cy="${ey + 0.5}" r="4.4" fill="#4a2e1c"/><circle cx="${ex + d * 1.5}" cy="${ey + 0.5}" r="2.2" fill="#1c100a"/><circle cx="${ex + d * 1.5 - 1.6}" cy="${ey - 1.4}" r="1.3" fill="#fff"/>
         <path d="M${ex - w / 2},${ey} q${w / 2},-7 ${w},0" stroke="#2d1c14" stroke-width="1.9" fill="none" stroke-linecap="round"/>`;
  const browLift = look.mood === "laugh" ? 3 : 0;
  const brow = (ex: number, w: number) => `<path d="M${ex - w / 2},${ey - 12 - browLift} q${w / 2},-5 ${w},-1" stroke="${mix(look.hair, -0.1)}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/>`;
  const eyes = d === 0 ? eye(fx - 14, 16) + eye(fx + 14, 16) + brow(fx - 14, 18) + brow(fx + 14, 18) : eye(near, 16) + eye(far, 11) + brow(near, 18) + brow(far, 13);
  const nose = d === 0
    ? `<path d="M${fx - 3},${cy + 4} q-1,6 3,8 q4,-1 4,-3" stroke="${dark}" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".8"/>`
    : `<path d="M${fx + d * 6},${cy - 2} q${d * 7},7 ${d * 1},12 l-${d * 5},1" stroke="${dark}" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".8"/>`;
  const lip = look.lips ?? "#a9564a";
  const mouth = look.mood === "laugh"
    ? `<path d="M${fx - 10},${cy + 18} q10,18 20,0 z" fill="#6e2a24"/><path d="M${fx - 8},${cy + 19} q8,3 16,0 l-1,2 q-7,3 -14,0 z" fill="#fff"/><path d="M${fx - 4},${cy + 28} q4,3 8,0 z" fill="#c9605a"/>`
    : look.mood === "smile"
      ? `<path d="M${fx - 9},${cy + 20} q9,9 18,0" stroke="${lip}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M${fx - 6},${cy + 22} q6,4 12,0" stroke="${mix(lip, 0.3)}" stroke-width="1.2" fill="none" opacity=".6"/>`
      : `<path d="M${fx - 8},${cy + 21} q8,4 16,0" stroke="${lip}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  const glasses = look.glasses ? `<g fill="none" stroke="#2d1c14" stroke-width="2.2" opacity=".85"><rect x="${(d === 0 ? fx - 14 : near) - 11}" y="${ey - 8}" width="22" height="16" rx="6"/><rect x="${(d === 0 ? fx + 14 : far) - (d === 0 ? 11 : 8)}" y="${ey - 8}" width="${d === 0 ? 22 : 16}" height="16" rx="6"/><line x1="${fx - 3}" y1="${ey - 3}" x2="${fx + 3}" y2="${ey - 3}"/></g>` : "";
  const ears = d === 0
    ? `<ellipse cx="${cx - 33}" cy="${cy + 2}" rx="6" ry="9" fill="${skin}"/><ellipse cx="${cx + 33}" cy="${cy + 2}" rx="6" ry="9" fill="${skin}"/>`
    : `<ellipse cx="${cx - d * 32}" cy="${cy + 2}" rx="6" ry="9" fill="${skin}"/><path d="M${cx - d * 34},${cy - 2} q${d * 3},4 ${d * 1},8" stroke="${dark}" stroke-width="1.4" fill="none" opacity=".6"/>`;
  return `<g id="${id}-head" data-px="${cx}" data-py="${cy + 44}">
    <defs>${skinDefs(id, look.skin)}</defs>
    ${hairBack}${ears}
    <path d="${face}" fill="${skin}"/>
    <path d="M${cx - 24},${cy + 22} C${cx - 14},${cy + 40} ${cx + 14},${cy + 40} ${cx + 24},${cy + 22}" stroke="${dark}" stroke-width="1.5" fill="none" opacity=".25"/>
    <circle cx="${fx - 18}" cy="${cy + 12}" r="9" fill="#e8907a" opacity=".22"/><circle cx="${fx + 18}" cy="${cy + 12}" r="9" fill="#e8907a" opacity=".22"/>
    ${eyes}${nose}${mouth}${glasses}
    ${hairFront}
  </g>`;
}

/** a hand at the wrist (hx, hy); `angle` is the forearm direction in degrees; a fist grips things, an open hand rests */
export function hand(hx: number, hy: number, angle: number, skin: string, kind: "fist" | "open" = "fist"): string {
  const dark = mix(skin, -0.28), lit = mix(skin, 0.08);
  const body = kind === "fist"
    ? `<path d="M-6,-9 L13,-10 Q22,-9 22,-1 L22,6 Q21,12 13,12 L-6,10 Z" fill="${skin}"/>
       <circle cx="20" cy="-5" r="4.2" fill="${lit}"/><circle cx="21" cy="1.5" r="4.2" fill="${lit}"/><circle cx="20" cy="8" r="4.2" fill="${lit}"/>
       <path d="M15,-8 l5,0 M16,-1 l5,0 M15,6 l5,0" stroke="${dark}" stroke-width="1.3" fill="none" opacity=".45"/>
       <path d="M2,-9 Q7,-19 16,-13 Q13,-8 6,-8 Z" fill="${skin}"/><path d="M4,-10 Q8,-16 14,-13" stroke="${dark}" stroke-width="1.2" fill="none" opacity=".4"/>
       <path d="M-6,10 L13,12 Q21,12 22,6" stroke="${dark}" stroke-width="1.6" fill="none" opacity=".35"/>`
    : `<path d="M-6,-9 L12,-10 L13,10 L-6,9 Z" fill="${skin}"/>
       ${[-7, -2, 3, 8].map((y, i) => `<path d="M12,${y} L${26 - Math.abs(i - 1.5) * 2},${y - 1}" stroke="${skin}" stroke-width="5" stroke-linecap="round"/>`).join("")}
       <path d="M0,-8 L9,-17" stroke="${skin}" stroke-width="5" stroke-linecap="round"/>
       <path d="M12,-8 L12,10" stroke="${dark}" stroke-width="1.2" fill="none" opacity=".35"/>`;
  return `<g transform="translate(${hx} ${hy}) rotate(${angle.toFixed(1)})">${body}</g>`;
}

/** an arm: shoulder → elbow → wrist as a bent limb with a lit upper edge, ending in a hand; `long` sleeves cover the forearm */
export function arm(sx: number, sy: number, ex: number, ey: number, hx: number, hy: number, o: { sleeve: string; skin: string; long?: boolean; w?: number; hand?: "fist" | "open" }): string {
  const w = o.w ?? 26, fw = w * 0.82;
  const angle = (Math.atan2(hy - ey, hx - ex) * 180) / Math.PI;
  const fore = o.long ? o.sleeve : o.skin;
  const nx = -(hy - ey), ny = hx - ex, nl = Math.hypot(nx, ny) || 1;   // normal to the forearm, for the shading offset
  const ox = (nx / nl) * 1.6, oy = (ny / nl) * 1.6;
  return `<path d="M${sx},${sy} L${ex},${ey}" stroke="${mix(o.sleeve, -0.3)}" stroke-width="${w}" fill="none" stroke-linecap="round"/>
    <path d="M${sx - ox},${sy - oy} L${ex - ox},${ey - oy}" stroke="${o.sleeve}" stroke-width="${w - 5}" fill="none" stroke-linecap="round"/>
    <path d="M${ex},${ey} L${hx},${hy}" stroke="${mix(fore, -0.26)}" stroke-width="${fw}" fill="none" stroke-linecap="round"/>
    <path d="M${ex - ox},${ey - oy} L${hx - ox},${hy - oy}" stroke="${fore}" stroke-width="${fw - 5}" fill="none" stroke-linecap="round"/>
    <circle cx="${ex}" cy="${ey}" r="${(w - 5) / 2}" fill="${o.sleeve}"/>
    ${o.long ? `<path d="M${hx - (hx - ex) * 0.1},${hy - (hy - ey) * 0.1} L${hx - (hx - ex) * 0.02},${hy - (hy - ey) * 0.02}" stroke="${mix(o.sleeve, 0.22)}" stroke-width="${fw - 3}" fill="none" stroke-linecap="butt"/>` : ""}
    ${hand(hx, hy, angle, o.skin, o.hand ?? "fist")}`;
}

/** a torso seen from the front; the neck base is at (cx, top) */
export function torsoFront(id: string, cx: number, top: number, cloth: string, o: { skin: string; collar?: "v" | "round" | "shirt"; height?: number; apron?: string }): string {
  const h = o.height ?? 160;
  const collar = o.collar ?? "round";
  return `<defs>${clothDefs(id, cloth)}</defs>
    <rect x="${cx - 13}" y="${top - 30}" width="26" height="36" rx="6" fill="${mix(o.skin, -0.2)}"/>
    <path d="M${cx - 70},${top + h} L${cx - 70},${top + 42} C${cx - 70},${top + 14} ${cx - 54},${top + 6} ${cx - 30},${top + 2} L${cx - 15},${top} L${cx + 15},${top} L${cx + 30},${top + 2} C${cx + 54},${top + 6} ${cx + 70},${top + 14} ${cx + 70},${top + 42} L${cx + 70},${top + h} Z" fill="url(#${id}-cloth)"/>
    <path d="M${cx + 30},${top + 2} C${cx + 54},${top + 6} ${cx + 70},${top + 14} ${cx + 70},${top + 42} L${cx + 70},${top + h} L${cx + 40},${top + h} C${cx + 46},${top + 80} ${cx + 44},${top + 30} ${cx + 30},${top + 2} Z" fill="rgba(0,0,0,.14)"/>
    ${collar === "v" ? `<path d="M${cx - 16},${top} L${cx},${top + 22} L${cx + 16},${top} Z" fill="${mix(o.skin, -0.12)}"/><path d="M${cx - 18},${top - 2} L${cx},${top + 24} L${cx + 18},${top - 2}" stroke="${mix(cloth, -0.35)}" stroke-width="4" fill="none" stroke-linejoin="round"/>`
      : collar === "shirt" ? `<path d="M${cx - 18},${top - 4} L${cx - 4},${top + 16} L${cx},${top + 6} L${cx + 4},${top + 16} L${cx + 18},${top - 4} L${cx + 22},${top + 6} L${cx + 6},${top + 22} L${cx - 6},${top + 22} L${cx - 22},${top + 6} Z" fill="${mix(cloth, 0.25)}"/>`
      : `<path d="M${cx - 16},${top - 2} q16,14 32,0" stroke="${mix(cloth, -0.35)}" stroke-width="4" fill="none"/>`}
    <path d="M${cx - 44},${top + 62} q6,32 -2,${h - 70}" stroke="rgba(0,0,0,.12)" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M${cx + 18},${top + 70} q-4,34 4,${h - 80}" stroke="rgba(0,0,0,.1)" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${o.apron ? `<path d="M${cx - 52},${top + 60} L${cx + 52},${top + 60} L${cx + 56},${top + h} L${cx - 56},${top + h} Z" fill="${o.apron}"/><path d="M${cx - 52},${top + 60} L${cx - 40},${top + 30} L${cx + 40},${top + 30} L${cx + 52},${top + 60}" fill="none" stroke="${mix(o.apron, -0.3)}" stroke-width="3"/><path d="M${cx + 20},${top + 60} L${cx + 52},${top + 60} L${cx + 56},${top + h} L${cx + 26},${top + h} Z" fill="rgba(0,0,0,.12)"/>` : ""}`;
}

/** a torso in three-quarter view, sitting on a stool and facing `d`; legs go down to top+250 */
export function torsoSide(id: string, cx: number, top: number, d: number, cloth: string, o: { skin: string; trousers?: string; height?: number }): string {
  const h = o.height ?? 150, f = (v: number) => cx + v * d, tr = o.trousers ?? "#2f2b45";
  return `<defs>${clothDefs(id, cloth)}</defs>
    <rect x="${cx - 12}" y="${top - 30}" width="24" height="36" rx="6" fill="${mix(o.skin, -0.2)}"/>
    <rect x="${cx - 48}" y="${top + h + 40}" width="96" height="16" rx="5" fill="#7a4a26"/><rect x="${cx - 40}" y="${top + h + 54}" width="9" height="76" fill="#5a3418"/><rect x="${cx + 31}" y="${top + h + 54}" width="9" height="76" fill="#5a3418"/><rect x="${cx - 40}" y="${top + h + 96}" width="80" height="6" fill="#5a3418"/>
    <path d="M${f(-18)},${top + h + 2} L${f(58)},${top + h + 2}" stroke="${mix(tr, -0.2)}" stroke-width="44" stroke-linecap="round" fill="none"/>
    <path d="M${f(50)},${top + h + 10} L${f(48)},${top + h + 100}" stroke="${tr}" stroke-width="34" stroke-linecap="round" fill="none"/>
    <path d="M${f(34)},${top + h + 104} L${f(70)},${top + h + 104}" stroke="#1d1712" stroke-width="18" stroke-linecap="round" fill="none"/>
    <path d="M${f(-42)},${top + h} L${f(-44)},${top + 34} C${f(-44)},${top + 10} ${f(-28)},${top + 2} ${f(-8)},${top} L${f(12)},${top} C${f(36)},${top + 2} ${f(50)},${top + 16} ${f(50)},${top + 42} L${f(48)},${top + h} Z" fill="url(#${id}-cloth)"/>
    <path d="M${f(-44)},${top + 34} C${f(-44)},${top + 10} ${f(-28)},${top + 2} ${f(-8)},${top} L${f(-2)},${top + 2} C${f(-20)},${top + 20} ${f(-30)},${top + 60} ${f(-28)},${top + h} L${f(-42)},${top + h} Z" fill="rgba(0,0,0,.16)"/>
    <path d="M${f(-2)},${top + 2} q${d * 12},12 ${d * 8},24" stroke="${mix(cloth, -0.35)}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M${f(20)},${top + 50} q${d * 6},30 ${d * 2},60" stroke="rgba(0,0,0,.12)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}
