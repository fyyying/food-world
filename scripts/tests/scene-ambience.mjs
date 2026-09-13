import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'rolldown';

const temp=await mkdtemp(join(tmpdir(),'room-ambience-'));
try {
  await build({input:'src/fw/scene-painted.ts',platform:'node',output:{file:join(temp,'painted.mjs'),format:'esm',banner:'import.meta.env={BASE_URL:"/"};'}});
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
  console.log('PASS: immediate steam, orientation reset, and automatic lamp/fire motion.');
} finally {await rm(temp,{recursive:true,force:true})}
