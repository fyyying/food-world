import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';
const dir = await mkdtemp(join(tmpdir(), 'camel-gait-'));
try {
  await build({input:'src/fw/camel-gait.ts',platform:'node',output:{file:join(dir,'gait.mjs'),format:'esm'}});
  const {camelFoot, camelLeg, CAMEL_CYCLE: cycle, CAMEL_SPEED: speed, CAMEL_LEG_LENGTH: length, CAMEL_HIP_HEIGHT: hip, CAMEL_PAD_HEIGHT: pad} = await import(pathToFileURL(join(dir,'gait.mjs')));
  const near = (a,b) => assert.ok(Math.abs(a-b)<1e-8, `${a} != ${b}`);
  for (let i=0;i<640;i++) {
    const t=i*cycle/640;
    assert.ok(camelFoot(t,-1).planted || camelFoot(t,1).planted, 'No airborne running phase');
    for (const side of [-1,1]) {
      const foot=camelFoot(t,side);
      near(foot.x,camelFoot(t+cycle,side).x);
      assert.ok(foot.y>=pad && foot.y<=pad+.120001);
      const next=camelFoot(t+.0001,side);
      if(foot.planted && next.planted) near(t*speed+foot.x,(t+.0001)*speed+next.x);
      for (const front of [false,true]) {
        const a=camelLeg(t,side,front);
        near(length*Math.sin(a.upper)+length*Math.sin(a.upper+a.lower),foot.x);
        near(hip-length*Math.cos(a.upper)-length*Math.cos(a.upper+a.lower),foot.y);
        near(a.upper+a.lower+a.pad,0);
      }
      // Side pairs share the same foot target, opposite sides are half a cycle apart.
      near(foot.x,camelFoot(t+cycle/2,-side).x);
    }
  }
  console.log('PASS: lateral timing, ground support, planted-foot speed, joint reach, level pads and loop continuity.');
} finally { await rm(dir,{recursive:true,force:true}); }
