/** Runs every node test harness in this folder. `npm test` calls it. */
import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const skip = new Set(['run.mjs', 'coplanar-surfaces.mjs']);   // coplanar-surfaces is a library used by other harnesses
const files = (await readdir(here)).filter((f) => f.endsWith('.mjs') && !skip.has(f)).sort();
let failed = 0;
for (const file of files) {
  const started = Date.now();
  const result = spawnSync(process.execPath, [join(here, file)], { stdio: 'pipe', encoding: 'utf8' });
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  if (result.status === 0) { console.log(`PASS ${seconds}s ${file}`); continue; }
  failed++;
  console.log(`FAIL ${seconds}s ${file}`);
  console.log((result.stdout + result.stderr).trim().split('\n').slice(-12).map((l) => `  ${l}`).join('\n'));
}
console.log(failed ? `${failed} of ${files.length} harnesses failed` : `${files.length} harnesses passed`);
process.exit(failed ? 1 : 0);
