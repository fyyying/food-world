import assert from 'node:assert/strict';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'rolldown';

const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):key==='measureText'?()=>({width:20}):()=>{},set:()=>true});
globalThis.document={visibilityState:'hidden',defaultView:{Element:class {}},createElement:()=>({ownerDocument:document,getContext:()=>ctx,style:{},setAttribute(){},classList:{add(){},remove(){},toggle(){}},addEventListener(){}})};
const temp=await mkdtemp(join(tmpdir(),'turkey-reactions-'));
try {
  await build({input:{props:'src/fw/props-turkey.ts',china:'src/fw/world-china.ts'},platform:'node',output:{dir:temp,entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs',format:'esm',banner:'import.meta.env={VITE_STATIC:"1",BASE_URL:"/"};'}});
  const {TURKEY_PROPS}=await import(pathToFileURL(join(temp,'props.mjs')));
  const dolma=TURKEY_PROPS.turkeyDolma();dolma.updateMatrixWorld(true);
  let pot;dolma.traverse(o=>{if(o.geometry?.parameters?.radiusTop===.34)pot=o});
  const potStart=pot.matrixWorld.clone();dolma.userData.poke();
  const board=dolma.getObjectByName('dolma-board'),boardStart=board.matrixWorld.clone();
  for(let i=0;i<180;i++){
    dolma.userData.tick(i/60,1/60);dolma.updateMatrixWorld(true);
    assert.deepEqual(pot.matrixWorld.elements,potStart.elements,'dolma cooking pot must stay on the table, not spin with the filling');
    assert.deepEqual(board.matrixWorld.elements,boardStart.elements,'the cutting board must stay still');
  }
  for(const id of ['turkeyOliveGrove','turkeyCitrus']){
    const grove=TURKEY_PROPS[id]();grove.updateMatrixWorld(true);grove.userData.poke();
    const drops=grove.children.filter(o=>o.name==='harvest-fruit');
    assert.ok(drops.length>=3,`${id}: tapping must release actual fruit from the branches`);
    const firstY=drops.map(o=>o.position.y);
    for(let i=0;i<30;i++)grove.userData.tick(i/60,1/60);
    assert.ok(drops.every((o,i)=>o.position.y<firstY[i]),`${id}: fruit must fall down`);
    for(let i=30;i<360;i++)grove.userData.tick(i/60,1/60);
    assert.equal(grove.children.filter(o=>o.name==='harvest-fruit').length,0,'harvest particles must clean up');
    for(let i=0;i<40;i++)grove.userData.poke();
    assert.ok(grove.children.filter(o=>o.name==='harvest-fruit').length<=24,'repeated taps must remain bounded');
  }
  const tea=TURKEY_PROPS.turkeyTeaHill();tea.userData.tick(0,0);
  const bushes=[];tea.traverse(o=>{if(o.name==='tea-bush')bushes.push(o)});
  assert.ok(bushes.length>=20);tea.userData.poke();tea.userData.tick(.3,.3);
  assert.ok(bushes.some(o=>Math.abs(o.rotation.z)>.02),'tea foliage should sway when brushed');
  const {buildChina}=await import(pathToFileURL(join(temp,'china.mjs')));
  const china=buildChina([]);china.group.updateMatrixWorld(true);
  const cues=china.group.children.filter(o=>o.name==='explore-cue');
  for(const id of ['pepper','chilli','hotpot'])assert.ok(cues.some(c=>c.userData.objectId===id),`${id}: China needs the same discovery diamond`);
  assert.equal(new Set(cues.map(c=>c.userData.objectId)).size,cues.length,'one marker per destination');
  for(const cue of cues){
    const target=china.placed.find(p=>p.obj.id===cue.userData.objectId);assert.ok(target);
    target.hit.geometry.computeBoundingBox();
    assert.ok(target.hit.geometry.boundingBox.clone().applyMatrix4(target.hit.matrixWorld).containsPoint(cue.position),'diamond must be inside its destination click target');
  }
  console.log('PASS: grounded dolma cookware, falling fruit, bounded repeat taps, tea foliage, and clickable China diamonds.');
} finally {await rm(temp,{recursive:true,force:true})}
