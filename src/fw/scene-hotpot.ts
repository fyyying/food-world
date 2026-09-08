// The hotpot house: the first Living Scene. A Sichuan hotpot room at night — lanterns, chilli strings, a divided
// pot rolling away on the burner, four diners, a cook and a server at the back, a cat under the table.
// All art is inline SVG in the 1600×900 stage of scene.ts; steam and bubbles are painted on the particle canvas.

import { flickerNoise, type SceneDef } from "./scene";
import { head, arm, torsoFront, torsoSide } from "./scene-figures";

const ZH = `font-family="'Noto Serif SC','Songti SC','PingFang SC','Hiragino Sans GB',serif"`;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

// ---------- SVG pieces ----------

function lantern(id: string, x: number, top: number, r: number, str: number) {
  const cy = top + str + r;
  const ribs = [-0.55, -0.2, 0.2, 0.55].map((k) => `<ellipse cx="${x}" cy="${cy}" rx="${(r * 0.86 * Math.abs(k)).toFixed(1)}" ry="${r}" fill="none" stroke="#8e1f18" stroke-width="${(r * 0.03).toFixed(1)}" opacity=".6"/>`).join("");
  return `<g id="${id}" data-px="${x}" data-py="${top}">
    <ellipse class="glow" cx="${x}" cy="${cy}" rx="${r * 2.1}" ry="${r * 1.7}" fill="url(#lanGlow)" opacity=".7"/>
    <line x1="${x}" y1="${top}" x2="${x}" y2="${top + str}" stroke="#3b1c14" stroke-width="${Math.max(2, r * 0.05)}"/>
    <rect x="${x - r * 0.42}" y="${top + str - r * 0.02}" width="${r * 0.84}" height="${r * 0.16}" rx="3" fill="#d9a441"/>
    <ellipse cx="${x}" cy="${cy}" rx="${r * 0.86}" ry="${r}" fill="url(#lanBody)"/>
    ${ribs}
    <ellipse cx="${x - r * 0.3}" cy="${cy - r * 0.35}" rx="${r * 0.22}" ry="${r * 0.32}" fill="#ffb26b" opacity=".35"/>
    <rect x="${x - r * 0.42}" y="${cy + r - r * 0.1}" width="${r * 0.84}" height="${r * 0.16}" rx="3" fill="#d9a441"/>
    <line x1="${x}" y1="${cy + r + r * 0.05}" x2="${x}" y2="${cy + r + r * 0.5}" stroke="#d9a441" stroke-width="${Math.max(2, r * 0.05)}"/>
    <path d="M${x - r * 0.12},${cy + r + r * 0.5} l${r * 0.24},0 l${r * 0.06},${r * 0.42} l-${r * 0.36},0 z" fill="#e0392f"/>
    ${r > 50 ? `<text x="${x}" y="${cy + r * 0.28}" text-anchor="middle" ${ZH} font-size="${r * 0.78}" font-weight="700" fill="#f6d98a" opacity=".9">福</text>` : ""}
  </g>`;
}

function chilliString(id: string, x: number, top: number, len: number) {
  let s = `<g id="${id}" data-px="${x}" data-py="${top}"><line x1="${x}" y1="${top}" x2="${x}" y2="${top + len}" stroke="#8b7a55" stroke-width="3"/>`;
  for (let y = top + 18; y < top + len; y += 30) {
    for (const side of [-1, 1]) {
      const ang = side * (28 + ((y * 7) % 20));
      s += `<g transform="rotate(${ang} ${x} ${y})"><path d="M${x},${y} c${side * 9},4 ${side * 14},30 ${side * 6},44 c-2,4 -6,2 ${-side * 8},-10 c-3,-12 -6,-26 0,-34 z" fill="${y % 60 < 30 ? "#d8382c" : "#b7281f"}"/><circle cx="${x}" cy="${y}" r="3" fill="#5f7a3a"/></g>`;
    }
  }
  return s + `<circle cx="${x}" cy="${top}" r="5" fill="#5a3a22"/></g>`;
}

function garlicBraid(x: number, top: number, n: number) {
  let s = `<line x1="${x}" y1="${top}" x2="${x}" y2="${top + n * 38}" stroke="#a9a07a" stroke-width="4"/>`;
  for (let i = 0; i < n; i++) {
    const y = top + 26 + i * 38, dx = (i % 2 ? 1 : -1) * 12;
    s += `<ellipse cx="${x + dx}" cy="${y}" rx="17" ry="19" fill="#efe4cf"/><path d="M${x + dx - 10},${y - 8} q10,-16 20,0" stroke="#c8b6c9" stroke-width="2" fill="none"/><path d="M${x + dx},${y - 20} q3,-8 8,-14" stroke="#b9ad8a" stroke-width="2" fill="none"/><path d="M${x + dx - 6},${y - 4} v14 M${x + dx + 6},${y - 4} v14" stroke="#d9cdb6" stroke-width="2"/>`;
  }
  return s;
}

function jar(x: number, y: number, w: number, h: number, color: string, lidRed = true) {
  return `<path d="M${x - w * 0.36},${y} q-${w * 0.14},-${h * 0.5} 0,-${h * 0.8} l${w * 0.72},0 q${w * 0.14},${h * 0.3} 0,${h * 0.8} z" fill="${color}"/>
    <ellipse cx="${x}" cy="${y - h * 0.8}" rx="${w * 0.36}" ry="${w * 0.12}" fill="#efe3cc"/>
    ${lidRed ? `<rect x="${x - w * 0.4}" y="${y - h * 0.86}" width="${w * 0.8}" height="${h * 0.12}" rx="3" fill="#b9302a"/>` : ""}
    <path d="M${x - w * 0.22},${y - h * 0.62} q${w * 0.05},${h * 0.2} 0,${h * 0.45}" stroke="rgba(255,235,200,.28)" stroke-width="${w * 0.08}" fill="none" stroke-linecap="round"/>`;
}

function plate(cx: number, cy: number, rx: number, ry: number, inner: string) {
  return `<ellipse cx="${cx}" cy="${cy + 4}" rx="${rx}" ry="${ry}" fill="rgba(0,0,0,.25)"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#f4ede0"/><ellipse cx="${cx}" cy="${cy}" rx="${rx - 8}" ry="${ry - 6}" fill="none" stroke="#c9d6d5" stroke-width="2"/>${inner}`;
}

function beefRolls(cx: number, cy: number) {
  let s = "";
  const spots: [number, number][] = [[-38, -6], [-14, -10], [10, -8], [34, -4], [-26, 8], [0, 6], [26, 10]];
  for (const [dx, dy] of spots) s += `<ellipse cx="${cx + dx}" cy="${cy + dy}" rx="14" ry="9" fill="#e07f78"/><ellipse cx="${cx + dx}" cy="${cy + dy}" rx="9" ry="5" fill="#f5c5bd"/><path d="M${cx + dx - 6},${cy + dy} q6,-4 12,0" stroke="#fff" stroke-width="1.6" fill="none"/>`;
  return s;
}

function greens(cx: number, cy: number) {
  let s = "";
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, r = 16 + (i % 3) * 8; s += `<ellipse cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r * 0.45).toFixed(1)}" rx="16" ry="7" transform="rotate(${((a * 180) / Math.PI).toFixed(0)} ${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r * 0.45).toFixed(1)})" fill="${i % 2 ? "#6fa35a" : "#4f8a44"}"/>`; }
  for (let i = 0; i < 7; i++) s += `<line x1="${cx + 40 + i * 4}" y1="${cy + 10}" x2="${cx + 34 + i * 5}" y2="${cy - 20}" stroke="#f6f0dc" stroke-width="3" stroke-linecap="round"/><circle cx="${cx + 34 + i * 5}" cy="${cy - 21}" r="3" fill="#e8dcbf"/>`;
  return s;
}

function tofuLotus(cx: number, cy: number) {
  let s = "";
  for (const [dx, dy] of [[-40, -2], [-20, 6], [-30, -12]] as [number, number][]) s += `<path d="M${cx + dx},${cy + dy} l18,-6 l18,6 l-18,6 z" fill="#f8f2df"/><path d="M${cx + dx},${cy + dy} l18,6 l0,8 l-18,-6 z" fill="#e9dfc2"/><path d="M${cx + dx + 18},${cy + dy + 6} l18,-6 l0,8 l-18,6 z" fill="#ddd1b0"/>`;
  for (const [dx, dy] of [[24, -4], [40, 6], [12, 10]] as [number, number][]) { s += `<ellipse cx="${cx + dx}" cy="${cy + dy}" rx="16" ry="9" fill="#efe4c3" stroke="#d3c39c" stroke-width="1.5"/>`; for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; s += `<ellipse cx="${(cx + dx + Math.cos(a) * 8).toFixed(1)}" cy="${(cy + dy + Math.sin(a) * 4.5).toFixed(1)}" rx="2.6" ry="1.6" fill="#d3c39c"/>`; } }
  return s;
}

function mushroomsEggs(cx: number, cy: number) {
  let s = "";
  for (const [dx, dy] of [[-36, 0], [-12, -8], [10, 4]] as [number, number][]) s += `<path d="M${cx + dx - 14},${cy + dy} q14,-20 28,0 z" fill="#a67b52"/><rect x="${cx + dx - 4}" y="${cy + dy}" width="8" height="9" fill="#e8d9b8"/>`;
  for (const [dx, dy] of [[30, -6], [42, 6], [26, 10]] as [number, number][]) s += `<ellipse cx="${cx + dx}" cy="${cy + dy}" rx="7" ry="9" fill="#f1e9d4"/><circle cx="${cx + dx - 2}" cy="${cy + dy - 3}" r="1.6" fill="#8a6a4a"/><circle cx="${cx + dx + 3}" cy="${cy + dy + 2}" r="1.3" fill="#8a6a4a"/>`;
  return s;
}

function bottle(x: number, y: number, color = "#3f7a3a") {
  return `<rect x="${x - 12}" y="${y - 60}" width="24" height="60" rx="5" fill="${color}"/><rect x="${x - 6}" y="${y - 84}" width="12" height="26" rx="3" fill="${color}"/><rect x="${x - 7}" y="${y - 88}" width="14" height="6" rx="2" fill="#d9a441"/><rect x="${x - 10}" y="${y - 44}" width="20" height="22" rx="2" fill="#f4ede0"/><rect x="${x - 7}" y="${y - 38}" width="14" height="4" fill="#c9401f"/><path d="M${x - 8},${y - 56} l0,40" stroke="rgba(255,255,255,.28)" stroke-width="3" stroke-linecap="round"/>`;
}

function glass(x: number, y: number) {
  return `<path d="M${x - 11},${y - 34} l22,0 l-3,34 l-16,0 z" fill="rgba(240,230,200,.55)" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/><path d="M${x - 9},${y - 20} l18,0 l-2,20 l-14,0 z" fill="#e9b53a" opacity=".85"/><ellipse cx="${x}" cy="${y - 22}" rx="9" ry="3" fill="#fff6d8"/>`;
}

function cat(x: number, y: number) {
  return `<g id="cat">
    <g id="cat-tail" data-px="${x + 48}" data-py="${y + 40}"><path d="M${x + 48},${y + 40} q40,-10 44,-50 q2,-20 -14,-24" stroke="#e39a4a" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M${x + 60},${y + 30} l8,-10 M${x + 82},${y + 10} l8,-8 M${x + 88},${y - 12} l10,-4" stroke="#b4692a" stroke-width="4" stroke-linecap="round"/></g>
    <ellipse cx="${x + 10}" cy="${y + 34}" rx="46" ry="30" fill="#e39a4a"/>
    <path d="M${x - 10},${y + 14} q20,-8 40,0 M${x - 6},${y + 26} q20,-8 40,0" stroke="#b4692a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="${x + 18}" cy="${y + 58}" rx="34" ry="10" fill="#e39a4a"/>
    <ellipse cx="${x - 2}" cy="${y + 62}" rx="10" ry="6" fill="#f6c58a"/><ellipse cx="${x + 30}" cy="${y + 62}" rx="10" ry="6" fill="#f6c58a"/>
    <g id="cat-head" data-px="${x - 24}" data-py="${y + 20}">
      <g id="cat-ear" data-px="${x - 12}" data-py="${y - 12}"><path d="M${x - 14},${y - 10} l-10,-26 l22,10 z" fill="#e39a4a"/><path d="M${x - 14},${y - 12} l-6,-16 l14,6 z" fill="#f3b6a0"/></g>
      <path d="M${x - 40},${y - 10} l-8,-26 l22,12 z" fill="#e39a4a"/><path d="M${x - 40},${y - 12} l-5,-16 l14,7 z" fill="#f3b6a0"/>
      <circle cx="${x - 26}" cy="${y + 4}" r="26" fill="#e39a4a"/>
      <path d="M${x - 40},${y - 12} q14,-8 28,0" stroke="#b4692a" stroke-width="3.5" fill="none"/>
      <path d="M${x - 40},${y + 2} q4,-6 8,0 M${x - 22},${y + 2} q4,-6 8,0" stroke="#3a241a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M${x - 30},${y + 12} l4,3 l4,-3 z" fill="#d97a70"/>
      <path d="M${x - 46},${y + 10} l-16,-3 M${x - 46},${y + 15} l-16,3 M${x - 6},${y + 10} l16,-3 M${x - 6},${y + 15} l16,3" stroke="#fff" stroke-width="1.6" opacity=".8"/>
      <circle cx="${x - 26}" cy="${y + 26}" r="6" fill="#d8382c"/><circle cx="${x - 26}" cy="${y + 26}" r="2.5" fill="#f6d98a"/>
    </g>
  </g>`;
}

// ---------- people (scene-figures.ts) ----------

/** diner A: a woman in a mustard blouse eating from her bowl, chopsticks up to her mouth */
function dinerA(cx: number, cy: number) {
  const id = "da", top = cy + 62, skin = "#f1c8a4", cloth = "#d9a441";
  return `<g id="${id}">
    ${torsoFront(id, cx, top, cloth, { skin, collar: "round" })}
    ${arm(cx - 58, top + 18, cx - 78, top + 82, cx - 34, top + 76, { sleeve: cloth, skin })}
    <g id="da-bowl"><ellipse cx="${cx - 8}" cy="${top + 66}" rx="30" ry="11" fill="#f4ede0"/><path d="M${cx - 38},${top + 66} q30,30 60,0 z" fill="#e6dcc6"/><ellipse cx="${cx - 8}" cy="${top + 66}" rx="24" ry="8" fill="#c9401f"/><path d="M${cx - 26},${top + 64} q18,-6 36,0" stroke="#f1e2b0" stroke-width="3" fill="none"/></g>
    ${head(id, cx, cy, 0, { skin, hair: "#2a1a14", style: "bob", mood: "smile" })}
    <g id="da-chop" data-px="${cx + 58}" data-py="${top + 18}">
      ${arm(cx + 58, top + 18, cx + 86, top + 70, cx + 42, top + 36, { sleeve: cloth, skin })}
      <line x1="${cx + 34}" y1="${top + 22}" x2="${cx + 12}" y2="${cy + 28}" stroke="#7a4a2a" stroke-width="3" stroke-linecap="round"/>
      <line x1="${cx + 40}" y1="${top + 28}" x2="${cx + 17}" y2="${cy + 33}" stroke="#7a4a2a" stroke-width="3" stroke-linecap="round"/>
      <path d="M${cx + 8},${cy + 26} q8,-6 14,2 q-4,8 -12,6 z" fill="#e58e86"/>
    </g>
  </g>`;
}

/** diner B: a man in a teal shirt, laughing, beer glass in the air */
function dinerB(cx: number, cy: number) {
  const id = "db", top = cy + 62, skin = "#e6b48c", cloth = "#3b7a6a";
  return `<g id="${id}">
    ${torsoFront(id, cx, top, cloth, { skin, collar: "v" })}
    ${arm(cx - 60, top + 18, cx - 94, top + 78, cx - 66, top + 104, { sleeve: cloth, skin, hand: "open" })}
    ${arm(cx + 60, top + 18, cx + 106, top + 52, cx + 96, top - 12, { sleeve: cloth, skin })}
    <path d="M${cx + 84},${top - 70} l24,0 l-3,50 l-18,0 z" fill="rgba(240,230,200,.62)" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><path d="M${cx + 86},${top - 52} l20,0 l-2,32 l-16,0 z" fill="#e9b53a"/><ellipse cx="${cx + 96}" cy="${top - 56}" rx="10" ry="3.5" fill="#fff6d8"/>
    ${head(id, cx, cy, 0, { skin, hair: "#1e1512", style: "short", mood: "laugh" })}
  </g>`;
}

/** diner C: side view facing the pot, ponytail, red jacket; her near arm works the chopsticks */
function dinerC(cx: number, cy: number) {
  const id = "dc", top = cy + 62, skin = "#f1c8a4", cloth = "#b9302a";
  return `<g id="${id}">
    ${arm(cx - 8, top + 22, cx + 40, top + 86, cx + 104, top + 70, { sleeve: cloth, skin, long: true, hand: "open" })}
    ${torsoSide(id, cx, top, 1, cloth, { skin, trousers: "#4a4670" })}
    ${head(id, cx, cy, 1, { skin, hair: "#2a1a14", style: "ponytail", mood: "smile" })}
    <g id="dc-arm" data-px="${cx + 34}" data-py="${top + 16}">
      ${arm(cx + 34, top + 16, cx + 112, top + 86, cx + 198, top + 42, { sleeve: cloth, skin, long: true })}
      <line x1="${cx + 210}" y1="${top + 32}" x2="${cx + 312}" y2="${top + 42}" stroke="#6b3d1f" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="${cx + 212}" y1="${top + 46}" x2="${cx + 312}" y2="${top + 54}" stroke="#6b3d1f" stroke-width="3.5" stroke-linecap="round"/>
      <g id="dc-slice" opacity="0"><path d="M${cx + 306},${top + 42} q12,-8 18,4 q-4,12 -16,10 q-8,-6 -2,-14 z" fill="#e58e86"/><path d="M${cx + 310},${top + 46} q6,-2 8,4" stroke="#fbe0da" stroke-width="2" fill="none"/></g>
    </g>
  </g>`;
}

/** diner D: side view facing left, glasses, blue shirt; raises a cup now and then */
function dinerD(cx: number, cy: number) {
  const id = "dd", top = cy + 62, skin = "#e6b48c", cloth = "#6a7fb5";
  return `<g id="${id}">
    ${arm(cx + 8, top + 22, cx - 30, top + 86, cx - 92, top + 70, { sleeve: cloth, skin, hand: "open" })}
    ${torsoSide(id, cx, top, -1, cloth, { skin, trousers: "#4d4a48" })}
    ${head(id, cx, cy, -1, { skin, hair: "#3a2a24", style: "short", mood: "calm", glasses: true })}
    <g id="dd-arm" data-px="${cx - 34}" data-py="${top + 16}">
      ${arm(cx - 34, top + 16, cx - 86, top + 82, cx - 118, top + 36, { sleeve: cloth, skin })}
      <path d="M${cx - 134},${top + 8} l28,0 l-4,28 l-20,0 z" fill="#f4ede0"/><ellipse cx="${cx - 120}" cy="${top + 8}" rx="14" ry="4" fill="#e6dcc6"/><ellipse cx="${cx - 120}" cy="${top + 8}" rx="9" ry="2.5" fill="#c99447"/>
    </g>
  </g>`;
}

/** the cook behind the counter: toque, white jacket; one hand steadies the meat on the board, the other brings the cleaver down */
function cook(cx: number, cy: number) {
  const id = "cook", top = cy + 62, skin = "#f1c8a4", cloth = "#f4f0e8";
  return `<g id="${id}">
    ${torsoFront(id, cx, top, cloth, { skin, collar: "shirt", height: 100 })}
    ${[0, 1, 2].map((i) => `<circle cx="${cx - 12}" cy="${top + 34 + i * 18}" r="3" fill="#cfc8bc"/><circle cx="${cx + 12}" cy="${top + 34 + i * 18}" r="3" fill="#cfc8bc"/>`).join("")}
    <rect x="${cx - 30}" y="${top + 56}" width="110" height="12" rx="3" fill="#b78a56"/><rect x="${cx - 30}" y="${top + 66}" width="110" height="4" fill="#8a6238"/>
    ${[-14, 4, 22].map((dx) => `<ellipse cx="${cx + dx}" cy="${top + 55}" rx="9" ry="4" fill="#d98a80"/><ellipse cx="${cx + dx}" cy="${top + 54}" rx="6" ry="2.5" fill="#f2c0b6"/>`).join("")}
    ${arm(cx - 58, top + 16, cx - 92, top + 68, cx - 30, top + 50, { sleeve: cloth, skin, long: true, hand: "open" })}
    ${head(id, cx, cy, 0, { skin, hair: "#2a1a14", style: "toque", mood: "smile" })}
    <g id="cook-arm" data-px="${cx + 58}" data-py="${top + 16}">
      ${arm(cx + 58, top + 16, cx + 100, top + 68, cx + 76, top + 20, { sleeve: cloth, skin, long: true })}
      <rect x="${cx + 44}" y="${top + 16}" width="34" height="10" rx="4" fill="#5a3a22"/>
      <path d="M${cx + 46},${top + 8} L${cx - 10},${top + 10} L${cx - 12},${top + 52} L${cx + 46},${top + 50} Z" fill="#c9ccd2"/><path d="M${cx + 46},${top + 8} L${cx - 10},${top + 10} L${cx - 10},${top + 18} L${cx + 46},${top + 16} Z" fill="#e8eaee"/><path d="M${cx - 12},${top + 52} L${cx + 46},${top + 50}" stroke="#f4f6f8" stroke-width="2"/>
    </g>
  </g>`;
}

/** the server, drawn at x = 0 so the group can be moved and mirrored */
function server() {
  const id = "server", cy = 420, top = cy + 62, skin = "#e6b48c", cloth = "#f1e8d6";
  return `<g id="${id}" opacity="0">
    <g id="server-legs" data-px="0" data-py="${top + 126}">
      <path d="M-14,${top + 126} L-16,${top + 204}" stroke="#2d2b3a" stroke-width="20" stroke-linecap="round"/><path d="M14,${top + 126} L16,${top + 204}" stroke="#3a384a" stroke-width="20" stroke-linecap="round"/>
      <path d="M-24,${top + 210} l22,0 M8,${top + 210} l22,0" stroke="#1d1712" stroke-width="12" stroke-linecap="round"/>
    </g>
    ${torsoFront(id, 0, top, cloth, { skin, collar: "shirt", height: 130 })}
    <path d="M-56,${top + 10} L-20,${top + 2} L0,${top + 40} L20,${top + 2} L56,${top + 10} L56,${top + 130} L-56,${top + 130} Z" fill="#b9302a"/><path d="M20,${top + 2} L56,${top + 10} L56,${top + 130} L26,${top + 130} Z" fill="rgba(0,0,0,.18)"/>
    ${arm(-58, top + 18, -76, top + 76, -30, top + 62, { sleeve: cloth, skin, long: true })}${arm(58, top + 18, 76, top + 76, 30, top + 62, { sleeve: cloth, skin, long: true })}
    <g id="server-tray"><ellipse cx="0" cy="${top + 52}" rx="76" ry="14" fill="#6b3a22"/><ellipse cx="0" cy="${top + 49}" rx="76" ry="14" fill="#8a5a30"/><ellipse cx="-30" cy="${top + 42}" rx="26" ry="10" fill="#f4ede0"/><ellipse cx="-30" cy="${top + 40}" rx="18" ry="6" fill="#e07f78"/><ellipse cx="26" cy="${top + 42}" rx="22" ry="9" fill="#f4ede0"/><ellipse cx="26" cy="${top + 40}" rx="14" ry="5" fill="#6fa35a"/><rect x="42" y="${top + 8}" width="14" height="36" rx="4" fill="#3f7a3a"/></g>
    ${head(id, 0, cy, 1, { skin, hair: "#1e1512", style: "cropped", mood: "calm" })}
  </g>`;
}


// ---------- the layers ----------

function backLayer() {
  const planks = Array.from({ length: 21 }, (_, i) => `<line x1="${i * 80}" y1="120" x2="${i * 80}" y2="640" stroke="rgba(0,0,0,.2)" stroke-width="3"/>`).join("");
  const knots = [[130, 300], [610, 560], [1010, 240], [1380, 520], [860, 470]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="14" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="2"/>`).join("");
  const tiles = Array.from({ length: 41 }, (_, i) => `<path d="M${i * 40},76 a20,16 0 0 0 40,0 z" fill="#23161a"/><path d="M${i * 40 + 6},76 a14,10 0 0 0 28,0 z" fill="#3a2830"/>`).join("");
  const tileLines = Array.from({ length: 40 }, (_, i) => `<line x1="${i * 40 + 20}" y1="0" x2="${i * 40 + 20}" y2="70" stroke="rgba(0,0,0,.35)" stroke-width="6"/>`).join("");
  const nails = Array.from({ length: 27 }, (_, i) => `<circle cx="${i * 60 + 20}" cy="108" r="3.5" fill="#d9a441" opacity=".8"/>`).join("");
  const lattice = (x: number, y: number, w: number, h: number) => {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#windowGlow)"/>`;
    for (let i = 1; i < 6; i++) s += `<line x1="${x + (w / 6) * i}" y1="${y}" x2="${x + (w / 6) * i}" y2="${y + h}" stroke="#4a2617" stroke-width="7"/>`;
    for (let i = 1; i < 6; i++) s += `<line x1="${x}" y1="${y + (h / 6) * i}" x2="${x + w}" y2="${y + (h / 6) * i}" stroke="#4a2617" stroke-width="7"/>`;
    s += `<rect x="${x + w / 6 * 2}" y="${y + h / 6 * 2}" width="${w / 3}" height="${h / 3}" fill="none" stroke="#4a2617" stroke-width="7"/>`;
    return s + `<rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" rx="3" fill="none" stroke="#6b3a22" stroke-width="14"/>`;
  };
  const scroll = (x: number, chars: string) => `<rect x="${x - 40}" y="118" width="80" height="12" rx="4" fill="#3b1c14"/><rect x="${x - 34}" y="128" width="68" height="300" fill="#b9302a"/><rect x="${x - 34}" y="128" width="68" height="300" fill="none" stroke="#7a1c18" stroke-width="4"/><path d="M${x - 34},428 l68,0 l0,14 l-34,10 l-34,-10 z" fill="#8e1f18"/>${chars.split("").map((c, i) => `<text x="${x}" y="${192 + i * 68}" text-anchor="middle" ${ZH} font-size="50" font-weight="700" fill="#f6e2b0">${c}</text>`).join("")}`;
  const backSteam = Array.from({ length: 5 }, (_, i) => `<ellipse id="bsteam-${i}" cx="${1150 + (i % 2) * 14}" cy="392" rx="${18 + i * 3}" ry="${10 + i * 2}" fill="#fff" opacity="0"/>`).join("");
  return `
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a3326"/><stop offset="1" stop-color="#3b1c15"/></linearGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1f18"/><stop offset="1" stop-color="#1f100c"/></linearGradient>
      <radialGradient id="lanGlow"><stop offset="0" stop-color="#ffb35a" stop-opacity=".55"/><stop offset=".6" stop-color="#ff7a3a" stop-opacity=".12"/><stop offset="1" stop-color="#ff5a2a" stop-opacity="0"/></radialGradient>
      <radialGradient id="lanBody" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ff6a4a"/><stop offset=".55" stop-color="#e0392f"/><stop offset="1" stop-color="#9e1f18"/></radialGradient>
      <linearGradient id="windowGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3b05f"/><stop offset="1" stop-color="#c66a30"/></linearGradient>
      <linearGradient id="sign" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a16"/><stop offset="1" stop-color="#160c0a"/></linearGradient>
      <linearGradient id="counter" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b3a22"/><stop offset="1" stop-color="#3f2013"/></linearGradient>
    </defs>
    <rect x="-100" y="-60" width="1800" height="1020" fill="url(#wall)"/>
    ${planks}${knots}
    <rect x="-100" y="640" width="1800" height="380" fill="url(#floor)"/>
    <rect x="-100" y="628" width="1800" height="16" fill="#241310"/>
    <rect x="-100" y="-60" width="1800" height="140" fill="#2b1a17"/>${tileLines}${tiles}
    <rect x="-100" y="92" width="1800" height="30" fill="#6b3a22"/><rect x="-100" y="118" width="1800" height="6" fill="#3b1c14"/>${nails}
    ${lattice(60, 200, 230, 240)}${lattice(1310, 200, 230, 240)}
    ${scroll(410, "人间烟火")}${scroll(1190, "最抚凡心")}
    <rect x="560" y="30" width="480" height="122" rx="10" fill="url(#sign)" stroke="#d9a441" stroke-width="7"/>
    <rect x="574" y="44" width="452" height="94" rx="6" fill="none" stroke="#b47f2a" stroke-width="2"/>
    <text x="800" y="121" text-anchor="middle" ${ZH} font-size="82" font-weight="700" fill="#f0c25a" letter-spacing="14">巴蜀味道</text>
    <path d="M574,44 l22,0 l0,22 M1026,44 l-22,0 l0,22 M574,138 l22,0 l0,-22 M1026,138 l-22,0 l0,-22" stroke="#f0c25a" stroke-width="3" fill="none"/>
    <rect x="560" y="286" width="480" height="14" rx="3" fill="#6b3a22"/><path d="M580,300 l12,26 M1020,300 l-12,26" stroke="#6b3a22" stroke-width="10"/>
    ${jar(600, 286, 58, 84, "#8a5a3a")}${jar(676, 286, 50, 70, "#a9764d")}${jar(752, 286, 62, 92, "#6f4a34")}${jar(836, 286, 54, 76, "#8a5a3a", false)}${jar(912, 286, 60, 88, "#9a6a46")}${jar(990, 286, 48, 66, "#6f4a34")}
    <rect x="600" y="386" width="400" height="12" rx="3" fill="#6b3a22"/>
    ${[620, 656, 692].map((x) => `<rect x="${x}" y="336" width="22" height="50" rx="4" fill="#efe6d6"/><rect x="${x + 3}" y="350" width="16" height="16" fill="#b9302a"/>`).join("")}
    ${[760, 786, 812, 838].map((x, i) => `<ellipse cx="${x + 12}" cy="${380 - i * 0}" rx="22" ry="7" fill="#f4ede0"/><ellipse cx="${x + 12}" cy="${370}" rx="22" ry="7" fill="#f4ede0"/><ellipse cx="${x + 12}" cy="${360}" rx="22" ry="7" fill="#f4ede0"/>`).join("")}
    ${[900, 936, 972].map((x) => `<path d="M${x},386 l0,-30 q0,-14 14,-14 q14,0 14,14 l0,30 z" fill="#c9a06a"/><rect x="${x + 4}" y="352" width="20" height="14" fill="#7a3a2a"/>`).join("")}
    ${chilliString("chilli-1", 520, 122, 230)}${chilliString("chilli-2", 1080, 122, 230)}
    <!-- a folding screen, the chalk menu and the tea station -->
    ${[0, 1, 2].map((i) => `<rect x="${196 + i * 142}" y="330" width="134" height="310" rx="4" fill="#4a2617"/><rect x="${206 + i * 142}" y="342" width="114" height="286" fill="#7a2a24"/><path d="M${232 + i * 142},560 q22,-90 12,-190 M${262 + i * 142},600 q18,-120 26,-230 M${292 + i * 142},580 q-14,-70 -2,-160" stroke="#9c4a3c" stroke-width="4" fill="none" stroke-linecap="round"/>${[0, 1, 2, 3].map((k) => `<path d="M${226 + i * 142 + k * 18},${420 + k * 40} l14,-8 l6,10 z" fill="#b25a4a" opacity=".8"/>`).join("")}`).join("")}
    <rect x="96" y="446" width="176" height="212" rx="6" fill="#2a2420" stroke="#8a5a30" stroke-width="6"/>
    <text x="184" y="484" text-anchor="middle" ${ZH} font-size="24" font-weight="700" fill="#f0c25a">今日 · 菜单</text>
    <line x1="114" y1="494" x2="254" y2="494" stroke="#f0c25a" stroke-width="1.5" opacity=".6"/>
    <text x="120" y="506" ${ZH} font-size="21" fill="#f3e9d2" opacity=".92">毛肚</text><text x="258" y="506" text-anchor="end" ${ZH} font-size="19" fill="#f0c25a" opacity=".92">¥38</text><text x="120" y="536" ${ZH} font-size="21" fill="#f3e9d2" opacity=".92">鸭血</text><text x="258" y="536" text-anchor="end" ${ZH} font-size="19" fill="#f0c25a" opacity=".92">¥18</text><text x="120" y="566" ${ZH} font-size="21" fill="#f3e9d2" opacity=".92">黄喉</text><text x="258" y="566" text-anchor="end" ${ZH} font-size="19" fill="#f0c25a" opacity=".92">¥32</text><text x="120" y="596" ${ZH} font-size="21" fill="#f3e9d2" opacity=".92">嫩牛肉</text><text x="258" y="596" text-anchor="end" ${ZH} font-size="19" fill="#f0c25a" opacity=".92">¥42</text><text x="120" y="626" ${ZH} font-size="21" fill="#f3e9d2" opacity=".92">藕片</text><text x="258" y="626" text-anchor="end" ${ZH} font-size="19" fill="#f0c25a" opacity=".92">¥12</text><text x="120" y="656" ${ZH} font-size="21" fill="#f3e9d2" opacity=".92">豆皮</text><text x="258" y="656" text-anchor="end" ${ZH} font-size="19" fill="#f0c25a" opacity=".92">¥14</text>
    <path d="M84,658 l-14,36 M284,658 l14,36" stroke="#8a5a30" stroke-width="8" stroke-linecap="round"/>
    <rect x="452" y="500" width="176" height="140" fill="#5a3319"/><rect x="452" y="492" width="176" height="14" fill="#7a4a26"/><rect x="464" y="520" width="152" height="52" rx="4" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="5"/>
    <ellipse cx="500" cy="490" rx="30" ry="9" fill="#3a3a40"/><path d="M472,490 q0,-40 28,-42 q28,2 28,42 z" fill="#4a4a52"/><path d="M528,470 q18,-6 22,10" stroke="#4a4a52" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="494" y="440" width="12" height="10" rx="2" fill="#2b2b2e"/>
    ${[0, 1, 2, 3].map((i) => `<ellipse cx="${560 + (i % 2) * 34}" cy="${486 - Math.floor(i / 2) * 12}" rx="15" ry="5" fill="#f4ede0"/><path d="M${545 + (i % 2) * 34},${486 - Math.floor(i / 2) * 12} l4,-10 l22,0 l4,10 z" fill="#e6dcc6"/>`).join("")}
    ${[0, 1, 2, 3].map((i) => `<ellipse id="tsteam-${i}" cx="${500 + i * 6}" cy="446" rx="${12 + i * 3}" ry="${7 + i}" fill="#fff" opacity="0"/>`).join("")}
    <rect x="1090" y="460" width="520" height="180" fill="url(#counter)"/><rect x="1090" y="452" width="520" height="16" fill="#8a5a30"/>
    ${[1120, 1240, 1360, 1480].map((x) => `<rect x="${x}" y="490" width="90" height="120" rx="6" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="6"/>`).join("")}
    ${cook(1231, 322)}
    ${[0, 1, 2].map((i) => `<ellipse cx="1150" cy="${452 - i * 26}" rx="52" ry="14" fill="#c9a877"/><rect x="1098" y="${440 - i * 26}" width="104" height="24" fill="#b4925e"/><path d="M1098,${440 - i * 26} l104,0" stroke="rgba(0,0,0,.2)" stroke-width="3"/>`).join("")}
    <ellipse cx="1150" cy="374" rx="52" ry="14" fill="#d9bd8c"/>
    ${backSteam}
    ${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="1520" cy="${452 - i * 9}" rx="30" ry="9" fill="${i % 2 ? "#f4ede0" : "#e6dcc6"}"/>`).join("")}
    <path d="M1420,452 l0,-40 q0,-14 14,-14 l52,0 q14,0 14,14 l0,40 z" fill="#2b2b2e"/><ellipse cx="1460" cy="398" rx="40" ry="10" fill="#4a4a50"/>
    ${server()}
    ${lantern("lan-1", 160, 124, 60, 36)}${lantern("lan-2", 300, 124, 42, 78)}${lantern("lan-3", 1300, 124, 42, 78)}${lantern("lan-4", 1440, 124, 60, 36)}
  `;
}

function midLayer() {
  const grain = [0, 1, 2, 3].map((i) => `<ellipse cx="800" cy="700" rx="${380 - i * 70}" ry="${105 - i * 20}" fill="none" stroke="rgba(0,0,0,.14)" stroke-width="3"/>`).join("");
  const redBits = [[-96, -8], [-70, 18], [-50, -22], [-30, 10], [-110, 14], [-62, -4], [-20, -14]].map(([dx, dy], i) => `<ellipse cx="${800 + dx}" cy="${612 + dy}" rx="9" ry="4" transform="rotate(${i * 37} ${800 + dx} ${612 + dy})" fill="#9c1f12"/>`).join("")
    + [[-84, 6], [-40, -8], [-100, -18], [-56, 20], [-24, 4], [-70, -26]].map(([dx, dy]) => `<circle cx="${800 + dx}" cy="${612 + dy}" r="2.6" fill="#3a1a10"/>`).join("")
    + `<path d="M${754},${626} l6,-6 l6,6 l-6,6 z M${730},${596} l6,-6 l6,6 l-6,6 z" fill="#6b3a1f"/>`
    + `<ellipse cx="740" cy="598" rx="30" ry="9" fill="rgba(255,190,110,.28)"/><ellipse cx="712" cy="620" rx="14" ry="5" fill="rgba(255,190,110,.22)"/>`;
  const whiteBits = [[30, -12], [60, 8], [96, -6], [44, 20], [82, 22], [110, 10]].map(([dx, dy]) => `<circle cx="${800 + dx}" cy="${612 + dy}" r="3.4" fill="#e0642a"/>`).join("")
    + [[50, -4], [92, 18]].map(([dx, dy]) => `<ellipse cx="${800 + dx}" cy="${612 + dy}" rx="8" ry="5" fill="#a33a2a"/>`).join("")
    + [[70, -14], [104, 4]].map(([dx, dy]) => `<ellipse cx="${800 + dx}" cy="${612 + dy}" rx="10" ry="6" fill="#c6a27a"/><ellipse cx="${800 + dx}" cy="${612 + dy}" rx="6" ry="3" fill="#a67b52"/>`).join("")
    + [[36, 6], [84, -16], [118, 16]].map(([dx, dy]) => `<rect x="${800 + dx}" y="${612 + dy}" width="14" height="4" rx="2" fill="#6fa35a" transform="rotate(${dx} ${800 + dx} ${612 + dy})"/>`).join("");
  return `
    <defs>
      <linearGradient id="pot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c88a48"/><stop offset="1" stop-color="#6e4020"/></linearGradient>
      <radialGradient id="broth" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#e8502c"/><stop offset="1" stop-color="#b8261a"/></radialGradient>
      <linearGradient id="tableTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b3d1f"/><stop offset="1" stop-color="#4c2a14"/></linearGradient>
      <linearGradient id="tableSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a2914"/><stop offset="1" stop-color="#2d180c"/></linearGradient>
      <radialGradient id="burnerGlow"><stop offset="0" stop-color="#ff8a4a" stop-opacity=".9"/><stop offset="1" stop-color="#ff5a2a" stop-opacity="0"/></radialGradient>
    </defs>
    ${dinerA(600, 470)}
    ${dinerB(1010, 466)}
    <rect x="380" y="700" width="840" height="240" fill="url(#tableSide)"/>
    <ellipse cx="800" cy="700" rx="430" ry="120" fill="url(#tableTop)" stroke="#2f1a0c" stroke-width="8"/>
    ${grain}
    <ellipse cx="800" cy="676" rx="176" ry="54" fill="#2b2b2e"/><ellipse cx="800" cy="668" rx="176" ry="54" fill="#3d3d44"/>
    <ellipse cx="800" cy="668" rx="150" ry="42" fill="#1c1c20"/><ellipse cx="800" cy="668" rx="120" ry="30" fill="url(#burnerGlow)"/>
    <path d="M652,612 l0,42 a148,46 0 0 0 296,0 l0,-42 z" fill="url(#pot)"/>
    <path d="M652,634 a148,46 0 0 0 296,0" fill="none" stroke="rgba(255,220,160,.25)" stroke-width="6"/>
    <path d="M636,600 q-30,0 -30,20 q0,20 30,20 M964,600 q30,0 30,20 q0,20 -30,20" stroke="#8f5a2c" stroke-width="12" fill="none" stroke-linecap="round"/>
    <ellipse cx="800" cy="612" rx="158" ry="60" fill="#c88a48" stroke="#e7b26a" stroke-width="7"/>
    <ellipse cx="800" cy="612" rx="140" ry="50" fill="url(#broth)"/>
    <path d="M800,562 C 745,580 855,644 800,662 A140,50 0 0 0 800,562 Z" fill="#f3e7d3"/>
    <path d="M800,562 C 745,580 855,644 800,662" stroke="#a8773b" stroke-width="6" fill="none"/><path d="M800,562 C 745,580 855,644 800,662" stroke="#e7b26a" stroke-width="2" fill="none"/>
    ${redBits}${whiteBits}
    <ellipse cx="820" cy="590" rx="40" ry="8" fill="rgba(255,255,255,.35)"/>
    ${plate(560, 742, 84, 32, beefRolls(560, 742))}
    ${plate(1040, 748, 84, 32, greens(1040, 748))}
    ${plate(612, 646, 66, 24, tofuLotus(612, 646))}
    ${plate(990, 648, 66, 24, mushroomsEggs(990, 648))}
    <ellipse cx="700" cy="794" rx="34" ry="14" fill="#f4ede0"/><ellipse cx="700" cy="790" rx="28" ry="10" fill="#c9a06a"/><circle cx="694" cy="788" r="3" fill="#6fa35a"/><circle cx="706" cy="792" r="2.5" fill="#e8dcbf"/><circle cx="700" cy="786" r="2" fill="#9c1f12"/>
    <ellipse cx="900" cy="798" rx="34" ry="14" fill="#f4ede0"/><ellipse cx="900" cy="794" rx="28" ry="10" fill="#8a4a2a"/><ellipse cx="900" cy="792" rx="20" ry="6" fill="#d8382c"/><circle cx="892" cy="792" r="2" fill="#f4ede0"/><circle cx="908" cy="791" r="2" fill="#f4ede0"/>
    <rect x="760" y="760" width="80" height="6" rx="3" fill="#6b3d1f" transform="rotate(-8 800 763)"/><rect x="760" y="768" width="80" height="6" rx="3" fill="#6b3d1f" transform="rotate(-8 800 771)"/>
    ${bottle(470, 700)}${bottle(1140, 706)}${glass(520, 732)}${glass(1090, 738)}
    <path d="M1160,640 q-30,0 -32,-22 q2,-24 32,-24 l40,0 q30,0 30,24 q0,22 -30,22 z" fill="#8a4a2a"/><path d="M1130,616 q-20,-8 -22,-24" stroke="#8a4a2a" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="1166" y="580" width="28" height="12" rx="3" fill="#8a4a2a"/><path d="M1168,588 l0,-8 M1192,588 l0,-8" stroke="#8a4a2a" stroke-width="4"/>
    ${[1084, 1112].map((x) => `<path d="M${x - 10},${640} l20,0 l-3,-22 l-14,0 z" fill="#e6dcc6"/><ellipse cx="${x}" cy="618" rx="7" ry="2.5" fill="#c99447"/>`).join("")}
    ${dinerC(400, 520)}
    ${dinerD(1200, 522)}
    ${cat(1340, 800)}
  `;
}

function frontLayer() {
  const staves = [110, 150, 190, 230, 270, 310].map((x) => `<line x1="${x}" y1="720" x2="${x}" y2="900" stroke="rgba(0,0,0,.22)" stroke-width="4"/>`).join("");
  let chillies = "";
  for (let i = 0; i < 26; i++) { const x = 100 + ((i * 53) % 220), y = 690 + ((i * 31) % 40) - 10, a = ((i * 67) % 140) - 70; chillies += `<g transform="rotate(${a} ${x} ${y})"><path d="M${x},${y} c14,4 22,30 10,46 c-3,4 -8,2 -12,-10 c-4,-12 -6,-26 2,-36 z" fill="${i % 3 ? "#d8382c" : "#b7281f"}"/><path d="M${x - 2},${y - 2} l-8,-8" stroke="#5f7a3a" stroke-width="3" stroke-linecap="round"/></g>`; }
  return `
    <defs>
      <radialGradient id="lanGlowF"><stop offset="0" stop-color="#ffb35a" stop-opacity=".5"/><stop offset=".6" stop-color="#ff7a3a" stop-opacity=".1"/><stop offset="1" stop-color="#ff5a2a" stop-opacity="0"/></radialGradient>
      <radialGradient id="lanBodyF" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ff6a4a"/><stop offset=".55" stop-color="#e0392f"/><stop offset="1" stop-color="#9e1f18"/></radialGradient>
      <linearGradient id="pillar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a1410"/><stop offset=".5" stop-color="#5a2e1c"/><stop offset="1" stop-color="#2a1410"/></linearGradient>
      <linearGradient id="barrel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a3419"/><stop offset=".45" stop-color="#9a6535"/><stop offset="1" stop-color="#4a2a14"/></linearGradient>
    </defs>
    <rect x="-100" y="-60" width="176" height="1020" fill="url(#pillar)"/>
    <rect x="10" y="150" width="54" height="360" rx="4" fill="#b9302a" stroke="#7a1c18" stroke-width="3"/>
    ${"麻辣鲜香".split("").map((c, i) => `<text x="37" y="212 " dy="${i * 84}" text-anchor="middle" ${ZH} font-size="40" font-weight="700" fill="#f6e2b0">${c}</text>`).join("")}
    ${garlicBraid(250, -20, 5)}
    <path d="M92,720 q-8,90 12,180 l232,0 q20,-90 12,-180 z" fill="url(#barrel)"/>
    ${staves}
    <rect x="86" y="760" width="268" height="14" rx="4" fill="#2b1a12"/><rect x="88" y="850" width="264" height="14" rx="4" fill="#2b1a12"/>
    <ellipse cx="220" cy="720" rx="130" ry="34" fill="#6a3a1c"/><ellipse cx="220" cy="716" rx="120" ry="28" fill="#8e1f18"/>
    ${chillies}
    <g id="lan-f" data-px="1520" data-py="-20">
      <ellipse cx="1520" cy="150" rx="260" ry="200" fill="url(#lanGlowF)" opacity=".7"/>
      <line x1="1520" y1="-20" x2="1520" y2="16" stroke="#3b1c14" stroke-width="6"/>
      <rect x="1470" y="14" width="100" height="18" rx="4" fill="#d9a441"/>
      <ellipse cx="1520" cy="140" rx="104" ry="120" fill="url(#lanBodyF)"/>
      ${[-0.55, -0.2, 0.2, 0.55].map((k) => `<ellipse cx="1520" cy="140" rx="${(104 * Math.abs(k)).toFixed(1)}" ry="120" fill="none" stroke="#8e1f18" stroke-width="4" opacity=".6"/>`).join("")}
      <ellipse cx="1484" cy="96" rx="26" ry="40" fill="#ffb26b" opacity=".35"/>
      <text x="1520" y="176" text-anchor="middle" ${ZH} font-size="96" font-weight="700" fill="#f6d98a" opacity=".9">火</text>
      <rect x="1470" y="248" width="100" height="18" rx="4" fill="#d9a441"/>
      <line x1="1520" y1="266" x2="1520" y2="300" stroke="#d9a441" stroke-width="6"/>
      <path d="M1506,300 l28,0 l8,52 l-44,0 z" fill="#e0392f"/>
    </g>
  `;
}

// ---------- particles ----------

type Steam = { x: number; y: number; vx: number; vy: number; r: number; a: number; life: number; age: number; drift: number };
type Bubble = { x: number; y: number; r: number; age: number; life: number; red: boolean };
const divider = (y: number) => 800 + 22 * Math.sin(((y - 612) / 50) * Math.PI);

function makeFx() {
  const steam: Steam[] = [], bubbles: Bubble[] = [];
  let acc = 0, bacc = 0;
  return (ctx: CanvasRenderingContext2D, t: number, dt: number) => {
    // broth: bubbles rise and burst in both halves; the red side boils harder
    bacc += dt * 9;
    while (bacc > 1) {
      bacc -= 1;
      const a = rnd(0, Math.PI * 2), r = Math.sqrt(Math.random());
      const x = 800 + Math.cos(a) * 128 * r, y = 612 + Math.sin(a) * 42 * r;
      const red = x < divider(y);
      if (!red && Math.random() < 0.45) continue;
      bubbles.push({ x, y, r: rnd(3, red ? 8 : 6), age: 0, life: rnd(0.5, 0.9), red });
    }
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i]; b.age += dt;
      const k = b.age / b.life;
      if (k >= 1) { bubbles.splice(i, 1); continue; }
      const rr = b.r * (k < 0.75 ? k / 0.75 : 1 + (k - 0.75) * 1.6);
      ctx.beginPath(); ctx.ellipse(b.x, b.y, rr, rr * 0.55, 0, 0, Math.PI * 2);
      if (k < 0.75) { ctx.fillStyle = b.red ? "rgba(255,120,70,.75)" : "rgba(255,255,255,.7)"; ctx.fill(); ctx.beginPath(); ctx.ellipse(b.x - rr * 0.3, b.y - rr * 0.2, rr * 0.3, rr * 0.18, 0, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,240,220,.7)"; ctx.fill(); }
      else { ctx.strokeStyle = b.red ? `rgba(255,170,110,${(1 - k) * 2})` : `rgba(255,255,255,${(1 - k) * 2})`; ctx.lineWidth = 1.5; ctx.stroke(); }
    }
    // a slow roll on the surface
    for (let i = 0; i < 3; i++) {
      const ph = t * 0.9 + i * 2.1, x = 800 + Math.sin(ph) * 90, y = 612 + Math.cos(ph * 0.7) * 24;
      ctx.beginPath(); ctx.ellipse(x, y, 26 + Math.sin(ph * 3) * 6, 7, 0, 0, Math.PI * 2);
      ctx.strokeStyle = x < divider(y) ? "rgba(255,200,140,.22)" : "rgba(255,255,255,.25)"; ctx.lineWidth = 2; ctx.stroke();
    }
    // steam
    acc += dt * 14;
    while (acc > 1) { acc -= 1; steam.push({ x: rnd(690, 910), y: rnd(580, 600), vx: rnd(-6, 6), vy: rnd(-46, -70), r: rnd(12, 20), a: rnd(0.22, 0.34), life: rnd(3, 4.6), age: 0, drift: rnd(0, 6.28) }); }
    for (let i = steam.length - 1; i >= 0; i--) {
      const s = steam[i]; s.age += dt;
      const k = s.age / s.life;
      if (k >= 1) { steam.splice(i, 1); continue; }
      s.x += (s.vx + Math.sin(t * 1.3 + s.drift) * 14) * dt; s.y += s.vy * dt;
      const r = s.r + k * 60, a = s.a * (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85);
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
      g.addColorStop(0, `rgba(255,246,236,${a})`); g.addColorStop(1, "rgba(255,246,236,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill();
    }
  };
}

// ---------- animation ----------

function makeAnimate(root: HTMLElement) {
  const q = (id: string) => root.querySelector<SVGGraphicsElement>(`#${id}`);
  const rot = (el: SVGGraphicsElement | null, deg: number, extra = "") => { if (!el) return; el.setAttribute("transform", `${extra} rotate(${deg.toFixed(2)} ${el.dataset.px} ${el.dataset.py})`); };
  const move = (el: SVGGraphicsElement | null, x: number, y: number) => { el?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`); };
  const lanterns = ["lan-1", "lan-2", "lan-3", "lan-4", "lan-f"].map((id, i) => ({ el: q(id), glow: q(id)?.querySelector<SVGElement>(".glow, ellipse") ?? null, ph: i * 1.7, sp: 0.9 + (i % 3) * 0.17, amp: i === 4 ? 1.6 : 2.6 }));
  const chillies = [q("chilli-1"), q("chilli-2")];
  const bsteam = [0, 1, 2, 3, 4].map((i) => q(`bsteam-${i}`));
  const tsteam = [0, 1, 2, 3].map((i) => q(`tsteam-${i}`));
  const cookArm = q("cook-arm"), cookHead = q("cook-head");
  const srv = q("server"), srvLegs = q("server-legs"), srvTray = q("server-tray");
  const daHead = q("da-head"), daBowl = q("da-bowl"), daChop = q("da-chop"), db = q("db"), dbHead = q("db-head");
  const dcArm = q("dc-arm"), dcSlice = q("dc-slice"), dcHead = q("dc-head");
  const ddArm = q("dd-arm"), ddHead = q("dd-head");
  const catTail = q("cat-tail"), catEar = q("cat-ear"), catHead = q("cat-head");
  const cat = q("cat");

  let serverT = 8, serverDir = 1, laughAt = 3.5, cupAt = 6, earAt = 4, chopPhase = 0;
  const ease = (k: number) => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;

  return (t: number, dt: number) => {
    for (const l of lanterns) {
      rot(l.el, Math.sin(t * l.sp + l.ph) * l.amp + Math.sin(t * l.sp * 2.3 + l.ph) * 0.4);
      l.glow?.setAttribute("opacity", (0.5 + flickerNoise(t, l.ph) * 0.35).toFixed(3));
    }
    chillies.forEach((c, i) => rot(c, Math.sin(t * 0.8 + i * 2) * 1.4));
    bsteam.forEach((s, i) => { const k = ((t * 0.32 + i * 0.2) % 1); s?.setAttribute("transform", `translate(${(Math.sin(t + i) * 8).toFixed(1)} ${(-k * 110).toFixed(1)}) scale(${(1 + k * 1.6).toFixed(2)})`); s?.setAttribute("transform-origin", `${1150 + (i % 2) * 14} 392`); s?.setAttribute("opacity", (0.4 * Math.sin(k * Math.PI)).toFixed(3)); });
    tsteam.forEach((s, i) => { const k = ((t * 0.3 + i * 0.25) % 1); s?.setAttribute("transform", `translate(${(Math.sin(t * 0.9 + i) * 5).toFixed(1)} ${(-k * 70).toFixed(1)})`); s?.setAttribute("opacity", (0.3 * Math.sin(k * Math.PI)).toFixed(3)); });
    // the cook chops in bursts
    const chop = (t % 5) < 2.2 ? Math.abs(Math.sin(t * 9)) : 0;   // the cleaver rests on the board, lifts and comes down in bursts
    rot(cookArm, -chop * 24); rot(cookHead, Math.sin(t * 1.3) * 2, `translate(0 ${(chop * 2).toFixed(1)})`);
    // the server passes every so often
    serverT -= dt;
    if (serverT < 0) { serverT = 15 + Math.random() * 8; serverDir = -serverDir; }
    if (serverT > 9 && serverT < 15.5) {
      const k = (15.5 - serverT) / 6.5, x = serverDir > 0 ? -140 + k * 1880 : 1740 - k * 1880;
      srv?.setAttribute("opacity", "1");
      const step = t * 7;
      move(srv, x, Math.abs(Math.sin(step)) * -5);
      if (srv) srv.setAttribute("transform", `translate(${x.toFixed(1)} ${(Math.abs(Math.sin(step)) * -5).toFixed(1)}) scale(${serverDir} 1)`);
      rot(srvLegs, Math.sin(step) * 16);
      srvTray?.setAttribute("transform", `translate(0 ${(Math.sin(step * 2) * 1.5).toFixed(1)})`);
    } else srv?.setAttribute("opacity", "0");
    // diner A: eats from her bowl, nods along
    rot(daHead, Math.sin(t * 0.9) * 3, `translate(0 ${(Math.sin(t * 1.8) * 2.5).toFixed(1)})`);
    daBowl?.setAttribute("transform", `translate(0 ${(Math.sin(t * 1.8 + 1) * 3 - 3).toFixed(1)})`);
    rot(daChop, Math.sin(t * 1.8) * 5 - 4);
    // diner B: laughs every ~9 s, otherwise sways
    laughAt -= dt;
    if (laughAt < -1.8) laughAt = 7 + Math.random() * 5;
    const laughing = laughAt < 0, lk = laughing ? -laughAt : 0;
    db?.setAttribute("transform", `translate(0 ${(laughing ? -Math.abs(Math.sin(lk * 9)) * 9 : Math.sin(t * 1.1) * 2).toFixed(1)})`);
    rot(dbHead, laughing ? -12 + Math.sin(lk * 9) * 4 : Math.sin(t * 0.8 + 1) * 3);
    // diner C: chopsticks go to the pot, wait, lift a slice out, bring it back
    chopPhase = (chopPhase + dt / 6.5) % 1;
    let arm: number, slice = 0;
    if (chopPhase < 0.18) arm = -30 + ease(chopPhase / 0.18) * 28;                         // reach over to the pot
    else if (chopPhase < 0.42) arm = -2 + Math.sin(((chopPhase - 0.18) / 0.24) * Math.PI * 4) * 2; // swish
    else if (chopPhase < 0.58) { const k = ease((chopPhase - 0.42) / 0.16); arm = -2 - k * 30; slice = k; }   // lift
    else if (chopPhase < 0.8) { arm = -32 + Math.sin(((chopPhase - 0.58) / 0.22) * Math.PI) * 3; slice = 1; }  // hold, cool it
    else { const k = ease((chopPhase - 0.8) / 0.2); arm = -32 + k * 2; slice = 1 - k; }        // bring it home
    rot(dcArm, arm); dcSlice?.setAttribute("opacity", slice.toFixed(2));
    rot(dcHead, Math.sin(t * 1.2 + 2) * 2.5 + (slice > 0.5 ? -5 : 0), `translate(0 ${(Math.sin(t * 1.5) * 2).toFixed(1)})`);
    // diner D: raises his cup now and then, watches B laugh
    cupAt -= dt;
    if (cupAt < -3) cupAt = 9 + Math.random() * 6;
    const ck = cupAt < 0 ? Math.min(1, -cupAt / 0.7) * (cupAt > -2.3 ? 1 : Math.max(0, (3 + cupAt) / 0.7)) : 0;
    rot(ddArm, -6 + ck * 48 + Math.sin(t * 1.5) * 1.5);   // his hand is left of the shoulder, so a positive turn lifts it
    rot(ddHead, (laughing ? 8 : 0) + Math.sin(t * 1.0 + 3) * 3 - ck * 6, `translate(0 ${(Math.sin(t * 1.4 + 2) * 2).toFixed(1)})`);
    // the cat
    rot(catTail, Math.sin(t * 1.7) * 14 + Math.sin(t * 4.1) * 3);
    earAt -= dt; if (earAt < -0.35) earAt = 3 + Math.random() * 5;
    rot(catEar, earAt < 0 ? Math.sin((-earAt / 0.35) * Math.PI) * -22 : 0);
    rot(catHead, Math.sin(t * 0.5) * 4, `translate(0 ${(Math.sin(t * 2.6) * 0.8).toFixed(1)})`);
    cat?.setAttribute("transform", `translate(0 ${(Math.sin(t * 2.6) * 1.2).toFixed(1)})`);
  };
}

export function hotpotScene(): SceneDef {
  return {
    id: "hotpot",
    title: "Hotpot house",
    zh: "火锅",
    caption: "A divided pot rolling on the burner, thin beef in and out in seconds, and a table that never empties.",
    layers: [
      { svg: backLayer(), depth: 0.22 },
      { svg: midLayer(), depth: 0.55 },
      { svg: frontLayer(), depth: 1, blur: 1.2 },
    ],
    fxDepth: 0.55,
    fx: makeFx(),
    light: { x: 800, y: 330, color: "rgba(255,190,110,0.32)" },
    animate: makeAnimate,
  };
}
