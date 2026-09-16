import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';
/** Every painted room is alive on entry with three or four always-on loops in both orientations (hotpot is the hand-laid exception above the ceiling). */
const root = process.cwd();
const real = resolve(root, 'src/fw/scene-painted.ts');
const stub = `export { pAt, at } from ${JSON.stringify(real)}; export const paintedScene = (cfg) => ({ __cfg: cfg });`;
const plugin = { name: 'stub', resolveId(src, importer) { if (src === './scene-painted' && importer && /scenes-(china|turkey|spain)\.ts$/.test(importer)) return '\0stub'; }, load(id) { if (id === '\0stub') return stub; } };
const dir = await mkdtemp(join(tmpdir(), 'loops-'));
try {
  await build({ input: { china: 'src/fw/scenes-china.ts', turkey: 'src/fw/scenes-turkey.ts', spain: 'src/fw/scenes-spain.ts', amb: 'src/fw/scene-ambience.ts' }, plugins: [plugin], platform: 'node', output: { banner: 'import.meta.env = { VITE_STATIC: "1", BASE_URL: "/" };', dir, format: 'esm', entryFileNames: '[name].mjs', chunkFileNames: '[name].mjs' } });
  globalThis.Image = class { constructor() { this.src = ''; } };
  globalThis.document = { createElement: () => ({ getContext: () => null }) };
  const [china, turkey, spain, amb] = await Promise.all(['china', 'turkey', 'spain', 'amb'].map(n => import(pathToFileURL(join(dir, `${n}.mjs`)))));
  const SIG = amb.PAINTED_SIGNATURES;
  const all = { ...china.SCENES, ...turkey.TURKEY_SCENES, ...spain.SPAIN_SCENES };
  const rows = [];
  for (const [id, make] of Object.entries(all)) {
    const r = make(); const cfg = r.__cfg ?? r;
    if (!cfg.folder) { rows.push([id, 'hand-laid', '', '', '']); continue; }
    const sig = cfg.painting ? SIG[cfg.id] : undefined;
    const steamLimit = cfg.id==='chaikhana'?5:cfg.id==='polo_kitchen'?4:['mantou_kitchen','roast_duck','jiangnan_home','bao_shop','xj_home'].includes(cfg.id)?3:['courtyard_kitchen','rice_wine','kebab_grill','caravan_stop'].includes(cfg.id)?2:1;
    const same=(a,b)=>Boolean(a&&b&&a.every((n,i)=>n===b[i]));
    const cand=(cfg.ambience??[]).filter(p=>!(sig&&p.kind===sig.kind&&(same(p.wide,sig.wide)||same(p.phone,sig.phone))));
    const count = (o) => {
      const steam = o==='wide' ? (cfg.steam?.length??0) : (cfg.portrait?.steam?.length??0);
      const fire = o==='wide' ? (cfg.fire?.length??0) : (cfg.portrait?.fire?.length??0);
      const heat = Number(steam>0)+Number(fire>0);
      const flyers = cfg.id==='hotpot' ? 0 : (['noodle_shop','teahouse','stone_bridge','lotus_garden','oasis_bazaar','tianshan','wheat_harvest'].includes(cfg.id) ? Math.min(1,(o==='wide'?cfg.walkers:cfg.portrait?.walkers??cfg.walkers)?.filter(w=>w.fly).length??0) : 0);
      const patches = sig ? cand.filter(p=>p[o==='wide'?'wide':'phone']).slice(0,Math.max(0,3-heat-flyers)) : (cfg.ambience??[]);
      const sigOn = sig ? Number(Boolean(sig[o==='wide'?'wide':'phone'])) : 0;
      const extra = sig ? 0 : Number(Boolean(cfg.pot))+Number((cfg.leaves??0)>0)+Number((cfg.motes??0)>0)+Number((cfg.lamps?.length??0)>0)+(cfg.hang?.filter(h=>h.sway).length??0);
      // a library sprite hung over the painting swings on its own timer, so it is an always-on loop in that orientation
      const hung = ((o==='wide' ? cfg.hung : cfg.portrait?.hung)??[]).filter(h=>h.sway).length;
      const loops = sigOn + Number(steam>0) + Number(fire>0) + flyers + patches.length + extra + hung;
      return { loops, steam: Math.min(steam, steamLimit), fire: Math.min(fire,1), patches: patches.map(p=>p.kind).join('+'), sig: sig ? sig.kind : 'n/a', flyers, hung };
    };
    const w = count('wide'), p = count('portrait');
    rows.push([id, `sig=${w.sig}`, `wide: loops=${w.loops} steam=${w.steam} fire=${w.fire} hung=${w.hung} ${w.patches}`, `portrait: loops=${p.loops} steam=${p.steam} fire=${p.fire} hung=${p.hung} ${p.patches}`, (w.loops<3||p.loops<3)?'BELOW3':(cfg.id!=='hotpot'&&(w.loops>4||p.loops>4))?'ABOVE4':'']);
  }
  const failures = rows.filter(r => r[4]);
  for (const r of failures) console.log(r.join(' | '));
  assert.equal(failures.length, 0, `${failures.length} rooms have fewer than three always-on loops in one orientation`);
  assert.ok(rows.length >= 54, 'every painted room is audited');
  console.log(`PASS: ${rows.length} rooms, three to four always-on loops in wide and portrait.`);
} finally { await rm(dir, { recursive: true, force: true }); }
