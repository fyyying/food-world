import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';
const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):()=>{},set:()=>true});
globalThis.document={createElement:()=>({getContext:()=>ctx})};
const dir=await mkdtemp(join(tmpdir(),'prop-supports-'));
try {
  await build({input:{base:'src/fw/props.ts',jn:'src/fw/props-jiangnan.ts',north:'src/fw/props-north.ts',xj:'src/fw/props-xinjiang.ts'},platform:'node',output:{dir,format:'esm',entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs'}});
  const modules=await Promise.all(['base','jn','north','xj'].map(n=>import(pathToFileURL(join(dir,`${n}.mjs`)))));
  const factories={...modules[0].PROPS,...modules[1].JN_PROPS,...modules[2].NORTH_PROPS,...modules[3].XJ_PROPS};
  const failures=[];let count=0;
  for(const [id,factory] of Object.entries(factories)) {
    const root=factory();root.updateMatrixWorld(true);const meshes=[],lanterns=[];
    root.traverse(o=>{if(o.isMesh)meshes.push(o);if(o.name==='hanging-lantern')lanterns.push(o)});
    for(const lantern of lanterns){
      count++;
      const anchor=lantern.localToWorld(lantern.userData.suspensionPoint.clone());
      let distance=Infinity;
      for(const mesh of meshes){let own=false;for(let p=mesh;p;p=p.parent)if(p===lantern)own=true;if(own)continue;
        mesh.geometry.computeBoundingBox();const bounds=mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);
        distance=Math.min(distance,bounds.distanceToPoint(anchor));
      }
      if(distance>.10)failures.push(`${id}: lantern at ${anchor.toArray().map(v=>v.toFixed(2))}, support gap ${distance.toFixed(3)}`);
      const swing=lantern.children[0];
      for(const time of [0,1,2,7,19]){lantern.userData.tick(time,.016);root.updateMatrixWorld(true);const cord=swing.children.at(-1);cord.geometry.computeBoundingBox();const top=cord.localToWorld(cord.position.clone().set(0,cord.geometry.boundingBox.max.y,0));assert.ok(top.distanceTo(anchor)<1e-7,`${id}: cord attachment drifts during sway`)}
    }
  }
  if(failures.length)console.log(failures.join('\n'));
  assert.equal(failures.length,0,'lanterns need nearby structural support');
  console.log(`PASS: ${count} lantern supports across ${Object.keys(factories).length} China props; suspension points remain fixed during sway.`);
}finally{await rm(dir,{recursive:true,force:true})}
