import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'rolldown';

const temp=await mkdtemp(join(tmpdir(),'world-availability-'));
try {
  await build({input:{availability:'src/fw/world-availability.ts'},platform:'node',output:{dir:temp,format:'esm',entryFileNames:'[name].mjs'}});
  const {isWorldAvailable,unavailableMaterialHsl}=await import(pathToFileURL(join(temp,'availability.mjs')));
  const worlds=['north-america','mexico','italy','central-europe','mediterranean','middle-east','india','china','southeast-asia','korea','japan'];
  assert.deepEqual(worlds.filter(id=>isWorldAvailable(id,true)),['middle-east','china'],'the public page exposes only completed worlds');
  assert.deepEqual(worlds.filter(id=>isWorldAvailable(id,false)),worlds,'local development keeps every world available');
  const vivid=unavailableMaterialHsl(.58,.9,.5);
  assert.equal(vivid.h,.58,'sleeping worlds retain their regional hue');
  assert.ok(vivid.s>0&&vivid.s<=.10,'sleeping worlds retain only a faint, consistent tint');
  assert.ok(vivid.l>=.28&&vivid.l<=.72,'sleeping worlds stay within the muted paper-lightness range');
  assert.equal(unavailableMaterialHsl(0,.01,.5).s,0,'already-neutral materials remain neutral');
  console.log('PASS: public availability, local workshop access, and consistent faint-tint muting.');
} finally {
  await rm(temp,{recursive:true,force:true});
}
