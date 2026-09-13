import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'rolldown';

const temp=await mkdtemp(join(tmpdir(),'room-ambience-'));
try {
  await build({input:{painted:'src/fw/scene-painted.ts',ambience:'src/fw/scene-ambience.ts',config:'src/fw/turkey-ambience.ts'},platform:'node',output:{dir:temp,entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs',format:'esm',banner:'import.meta.env={BASE_URL:"/"};'}});
  globalThis.Image=class {complete=false;naturalWidth=0};
  const {paintedScene}=await import(pathToFileURL(join(temp,'painted.mjs')));
  const scene=paintedScene({id:'tr_coffee',folder:'tr_coffee',title:'Test',zh:'',caption:'',painting:true,hotspots:[],
    steam:[{x:200,y:600,w:40,rate:8}],portrait:{steam:[{x:1100,y:400,w:30,rate:6}]},
    lamps:[{x:800,y:100,r:50}],fire:[{x:900,y:600,rx:40,ry:20}],light:{x:800,y:100,color:'#fff'}});
  let gradients=[];
  const ctx=new Proxy({}, {get:(_,key)=>key==='createRadialGradient'?(...args)=>{gradients.push(args);return {addColorStop(){}}}:()=>{},set:()=>true});
  scene.fx(ctx,0,0,false);
  assert.ok(gradients.length>=8,'steam must already be visible on entry, with zero elapsed time and no click');
  assert.ok(gradients.every(([x,y])=>x>=180&&x<=220&&y<600),'initial wide steam must rise from its own vessel');
  gradients=[];scene.fx(ctx,.1,0,true);
  assert.ok(gradients.length>=6,'portrait needs its own established plume');
  assert.ok(gradients.every(([x,y])=>x>=1085&&x<=1115&&y<400),'rotation must remove steam from old wide coordinates');
  const lamp={opacity:'',setAttribute(_name,value){this.opacity=value}},fire={...lamp};
  const tick=scene.animate({querySelectorAll:selector=>selector==='[id^=lamp-]'?[lamp]:selector==='[id^=fire-]'?[fire]:[]});
  tick(0,0);const first=[lamp.opacity,fire.opacity];tick(1,.016);
  assert.notDeepEqual([lamp.opacity,fire.opacity],first,'lamp and fire must move without an interaction');
  assert.ok([lamp.opacity,fire.opacity].every(n=>Number(n)>0&&Number(n)<=1));
  const {ambientPainter}=await import(pathToFileURL(join(temp,'ambience.mjs')));
  const {TURKEY_AMBIENCE}=await import(pathToFileURL(join(temp,'config.mjs')));
  const loaded=[];
  globalThis.Image=class {complete=true;naturalWidth=20;naturalHeight=32;set src(url){loaded.push(url)}};
  for(const portrait of [false,true]){
    const leaf=TURKEY_AMBIENCE.tr_meze.find(p=>p.kind==='leaves');assert.ok(leaf?.[portrait?'phone':'wide']);
    const paint=ambientPainter([leaf]);let draws=[],positions=[];
    const leafCtx=new Proxy({canvas:{width:portrait?506:1600},getTransform:()=>({a:1})},{get:(target,k)=>k in target?target[k]:k==='drawImage'?(...args)=>draws.push(args):k==='translate'?(...args)=>positions.push(args):()=>{},set:()=>true});
    paint(leafCtx,0,portrait);const start=positions[0];
    assert.equal(draws.length,4,'recognizable painted leaves must already be in flight on entry');
    assert.ok(draws.every(a=>a[4]>=18&&a[4]<=42),'leaves need readable silhouettes at normal viewing size');
    positions=[];draws=[];paint(leafCtx,1.9,portrait);
    assert.ok(positions[0][1]-start[1]>45,'leaves must travel visibly through the opening, not hover in place');
  }
  assert.ok(loaded.every(url=>url.includes('/hotpot/leaf-')),'ambient motion must not load a second copy of the room painting');
  const olive=TURKEY_AMBIENCE.tr_olive;
  for(const orientation of ['wide','phone'])assert.ok(olive.some(p=>p.kind==='water'&&p[orientation]),'olive grove sea needs continuous motion');
  assert.ok(olive.some(p=>p.kind==='oil'&&p.phone),'the visible press stream must flow');
  assert.ok(Object.values(TURKEY_AMBIENCE).flat().every(p=>p.kind!=='breeze'),'shifted foliage patches produce blurry duplicate branches');
  console.log('PASS: immediate steam, orientation reset, automatic lights, readable falling leaves, sea/oil motion, and no duplicate painting layers.');
} finally {await rm(temp,{recursive:true,force:true})}
