import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'rolldown';
const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):key==='measureText'?()=>({width:20}):()=>{},set:()=>true});
globalThis.document={visibilityState:'hidden',defaultView:{Element:class {}},createElement:()=>({ownerDocument:document,getContext:()=>ctx,style:{},setAttribute(){},classList:{add(){},remove(){},toggle(){}},addEventListener(){}})};
const temp=await mkdtemp(join(tmpdir(),'xinjiang-reactions-'));
try{
  await build({input:'src/fw/props-xinjiang.ts',platform:'node',output:{file:join(temp,'props.mjs'),format:'esm',banner:'import.meta.env={VITE_STATIC:"1",BASE_URL:"/"};'}});
  const props=await import(pathToFileURL(join(temp,'props.mjs')));
  const bubbleCount=root=>{let count=0;root.traverse(o=>{if(o.element?.className==='bubble')count++;});return count;};
  const ordered=props.naanBakery(),bread=ordered.getObjectByName('tonur-bread'),breadY=bread.scale.y;
  ordered.userData.poke();assert.equal(bubbleCount(ordered),0,'speech waits for the bread response');
  ordered.userData.tick(.1,.1);assert.notEqual(bread.scale.y,breadY,'bread moves on the first reaction frame');
  assert.equal(bubbleCount(ordered),0,'speech remains subordinate during the first beat');
  ordered.userData.tick(.4,.3);assert.equal(bubbleCount(ordered),1,'speech follows the physical response');
  const orchard=props.apricotWalnut(),count=orchard.children.length;
  for(let i=0;i<40;i++)orchard.userData.poke();
  assert.ok(orchard.children.length<=count+24,'repeated apricot clicks must remain bounded');
  for(let i=0;i<240;i++)orchard.userData.tick(i/60,1/60);
  assert.equal(orchard.children.length,count,'falling fruit must clean up');
  for(const id of ['kebabGrill','naanBakery','poloKitchen','oasisField','fatTailSheep']){
    const stand=props[id]();assert.equal(stand.userData.ownReaction,true,`${id}: disable generic reaction`);
    const roots=stand.children.map(o=>[o,o.position.y]);
    stand.userData.poke();stand.userData.tick(.2,.2);
    assert.ok(roots.filter(([o])=>o.userData.upper).every(([o,y])=>o.position.y===y),`${id}: people stay on their supports`);
  }
  for(const [id,name] of [['naanBakery','tonur-bread'],['poloKitchen','polo-rice'],['xjHomeKitchen','home-dough'],['carrotPatch','pulled-carrot']]){
    const stand=props[id](),subject=stand.getObjectByName(name);assert.ok(subject,`${id}: named process subject`);
    stand.userData.tick(0,0);subject.updateMatrix();const start=subject.matrix.clone();
    stand.userData.poke();stand.userData.tick(.5,.5);subject.updateMatrix();
    assert.notDeepEqual(subject.matrix.elements,start.elements,`${id}: preparation visibly changes`);
    for(let i=0;i<240;i++)stand.userData.tick(i/60,1/60);
    subject.updateMatrix();assert.deepEqual(subject.matrix.elements,start.elements,`${id}: preparation settles exactly without drift`);
  }
  const feast=props.eveningFeast(),feastPlatter=feast.getObjectByName('feast-platter'),platterStart=feastPlatter.position.clone();
  feast.userData.poke();feast.userData.tick(.5,.5);
  assert.deepEqual(feastPlatter.position.toArray(),platterStart.toArray(),'evening feast platter remains supported while its food responds');
  const arrivals=[
    ['kebabGrill','kebab-skewer',.25],['naanBakery','tonur-bread',.30],['poloKitchen','polo-topping',.20],
    ['laghmanShop','laghman-rope',.25],['oasisBazaar','weighed-melon',.30],['grapeCourtyard','courtyard-tea-bowl',.18],
    ['chaikhana','chaikhana-tea-bowl',.18],['xjHomeKitchen','home-dough',.22],['eveningFeast','feast-food',.22],
    ['cuminStall','cumin-scoop',.22],['carrotPatch','pulled-carrot',.38],
  ];
  for(const [id,name,minTravel] of arrivals){
    const stand=props[id](),subject=stand.getObjectByName(name);assert.ok(subject,`${id}: needs a named food or material response`);
    const start=subject.position.clone();stand.userData.poke();for(let i=1;i<=16;i++)stand.userData.tick(i*.1,.1);
    assert.ok(subject.position.distanceTo(start)>=minTravel,`${id}: ${name} must remain clearly displaced at 1.6 second camera arrival`);
    if(id==='laghmanShop'){
      const strands=subject.children;assert.ok(subject.position.z>=.8,'laghman rope lands over the board rather than beside the counter');
      assert.ok(strands.every(s=>subject.position.y+s.position.y-.012>=.875),'laghman strands remain above the board surface');
    }
  }
  const apricots=props.apricotWalnut();apricots.userData.poke();const fallingApricot=apricots.getObjectByName('falling-apricot'),apricotStart=fallingApricot.position.clone();
  for(let i=1;i<=16;i++)apricots.userData.tick(i*.1,.1);
  assert.ok(fallingApricot.position.distanceTo(apricotStart)>=.8,'apricot fall must still be clearly visible at 1.6 second camera arrival');
  console.log('PASS: bounded apricots, reaction ownership and grounded people.');
}finally{await rm(temp,{recursive:true,force:true});}
