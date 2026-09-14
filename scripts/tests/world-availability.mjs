import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'rolldown';

const temp=await mkdtemp(join(tmpdir(),'world-availability-'));
try {
  await build({input:{availability:'src/fw/world-availability.ts'},platform:'node',output:{dir:temp,format:'esm',entryFileNames:'[name].mjs'}});
  const {isWorldAvailable}=await import(pathToFileURL(join(temp,'availability.mjs')));
  const worlds=['north-america','mexico','italy','central-europe','mediterranean','middle-east','india','china','southeast-asia','korea','japan'];
  assert.deepEqual(worlds.filter(id=>isWorldAvailable(id,true)),['middle-east','china'],'the public page exposes only completed worlds');
  assert.deepEqual(worlds.filter(id=>isWorldAvailable(id,false)),worlds,'local development keeps every world available');
  console.log('PASS: public availability is limited to China and Middle East; local development remains unrestricted.');
} finally {
  await rm(temp,{recursive:true,force:true});
}
