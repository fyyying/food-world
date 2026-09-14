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
  await build({input:{props:'src/fw/props-turkey.ts',town:'src/fw/turkey-town.ts',china:'src/fw/world-china.ts'},platform:'node',output:{dir:temp,entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs',format:'esm',banner:'import.meta.env={VITE_STATIC:"1",BASE_URL:"/"};'}});
  const {TURKEY_PROPS}=await import(pathToFileURL(join(temp,'props.mjs')));
  const bubbleCount=root=>{let count=0;root.traverse(o=>{if(o.element?.className==='bubble')count++;});return count;};
  const ordered=TURKEY_PROPS.turkeyPide(),puff=[];ordered.traverse(o=>{if(o.userData.foodReaction==='puff')puff.push(o)});
  const puffY=puff[0].scale.y;ordered.userData.poke();
  assert.equal(bubbleCount(ordered),0,'speech waits for the food response');
  ordered.userData.tick(.1,.1);assert.notEqual(puff[0].scale.y,puffY,'food moves on the first reaction frame');
  assert.equal(bubbleCount(ordered),0,'speech remains subordinate during the first beat');
  ordered.userData.tick(.4,.3);assert.equal(bubbleCount(ordered),1,'speech follows the physical response');
  for(const id of ['turkeyBreakfast','turkeyMeze','turkeySupper','turkeyBaklava']){
    const stand=TURKEY_PROPS[id]();const dishes=[];
    stand.traverse(o=>{if(o.name==='food-bowl'||o.name==='baklava-tray')dishes.push([o,o.position.clone()]);});
    stand.userData.poke();stand.userData.tick(.4,.4);
    assert.ok(dishes.every(([o,p])=>o.position.equals(p)),`${id}: dishes must not slide apart`);
  }
  const baklava=TURKEY_PROPS.turkeyBaklava(),servingPiece=baklava.getObjectByName('baklava-serving-piece'),syrupStream=baklava.getObjectByName('baklava-syrup-stream');
  const servingStart=servingPiece.position.clone();
  assert.ok(syrupStream,'baklava needs one continuous syrup stream readable from the world camera');
  baklava.userData.poke();baklava.userData.tick(.35,.35);
  assert.notDeepEqual(servingPiece.position.toArray(),servingStart.toArray(),'one baklava piece must lift while its tray remains still');
  assert.equal(syrupStream.visible,true,'the syrup stream must be visible during the first food beat');
  const arrivalBaklava=TURKEY_PROPS.turkeyBaklava(),arrivalStream=arrivalBaklava.getObjectByName('baklava-syrup-stream');arrivalBaklava.userData.poke();
  for(let i=1;i<=16;i++)arrivalBaklava.userData.tick(i*.1,.1);
  assert.equal(arrivalStream.visible,true,'the primary food response must still be visible at the end of the 1.6 second room approach');
  const coffee=TURKEY_PROPS.turkeyCoffee(),coffeeStream=coffee.getObjectByName('coffee-stream');coffee.userData.poke();coffee.userData.tick(.45,.45);
  assert.equal(coffeeStream.visible,true,'coffee uses a connected stream rather than only tiny beads');
  for(const id of ['turkeyBreakfast','turkeyMeze']){const stand=TURKEY_PROPS[id](),stream=stand.getObjectByName(id==='turkeyBreakfast'?'breakfast-stream':'meze-stream');stand.userData.poke();stand.userData.tick(.45,.45);assert.equal(stream.visible,true,`${id}: a connected serving stream must reach one reacting dish`);}
  const pide=TURKEY_PROPS.turkeyPide(),paddle=pide.getObjectByName('pide-paddle'),paddleStart=paddle.position.clone();pide.userData.poke();pide.userData.tick(.8,.8);
  assert.deepEqual(paddle.position.toArray(),paddleStart.toArray(),'pide paddle stays grounded while the modeled loaf hops');
  const doner=TURKEY_PROPS.turkeyDoner();
  assert.ok(doner.getObjectByName('doner-slice'),'döner needs a visible slice, not only spit rotation');
  const simit=TURKEY_PROPS.turkeySimitCart();let movingRings=0;
  simit.traverse(o=>{if(o.userData.foodReaction==='simit')movingRings++;});
  assert.equal(movingRings,1,'only one ring should be offered');
  const teaGarden=TURKEY_PROPS.turkeyTeaGarden(),kettle=teaGarden.getObjectByName('tea-kettle'),stream=teaGarden.getObjectByName('tea-stream'),ripple=teaGarden.getObjectByName('tea-ripple'),teaGlass=teaGarden.getObjectByName('tea-glass'),teaSaucer=teaGarden.getObjectByName('served-tea-saucer'),saucerStart=teaSaucer.position.clone();
  assert.ok(kettle&&stream&&ripple,'tea garden needs one readable kettle, stream and cup ripple');
  const kettleStart=kettle.rotation.z;teaGarden.userData.poke();teaGarden.userData.tick(.35,.35);
  assert.notEqual(kettle.rotation.z,kettleStart,'the kettle must visibly tip before tea flows');
  assert.equal(stream.visible,true,'a continuous tea stream must replace tiny disconnected drops');
  assert.deepEqual(teaSaucer.position.toArray(),saucerStart.toArray(),'the tea saucer stays on its table while only the glass lifts');
  teaGarden.userData.tick(.9,.55);assert.equal(ripple.visible,true,'the filled glass answers with a visible ripple');
  teaGarden.updateMatrixWorld(true);const target=teaGlass.getWorldPosition(teaGlass.position.clone()).add({x:0,y:.20,z:0}),axis=stream.position.clone().set(0,.5,0).applyQuaternion(stream.quaternion).multiplyScalar(stream.scale.y),endA=stream.position.clone().add(axis),endB=stream.position.clone().sub(axis);
  assert.ok(Math.min(endA.distanceTo(target),endB.distanceTo(target))<.03,'tea stream follows the lifted glass instead of missing it');
  const arrivalCases=[
    ['turkeySimitCart','',o=>o.userData.foodReaction==='simit',.35],
    ['turkeyTeaGarden','tea-glass',null,.18],['turkeyCoffee','coffee-surface',null,.18],['turkeyFish','fish-flip',null,.35],
    ['turkeyKebab','charcoal-skewer',null,.25],['turkeyBaklava','baklava-serving-piece',null,.30],['turkeyPide','pide-loaf',null,.25],
    ['turkeyYufka','yufka-sheet',null,.38],['turkeyDolma','dolma-roll',null,.25],['turkeyBreakfast','reacting-food',null,.18],
    ['turkeyMeze','reacting-food',null,.18],['turkeySupper','reacting-food',null,.18],
  ];
  for(const [id,name,predicate,minTravel] of arrivalCases){
    const stand=TURKEY_PROPS[id](),subject=name?stand.getObjectByName(name):(()=>{let found;stand.traverse(o=>{if(!found&&predicate?.(o))found=o});return found})();
    assert.ok(subject,`${id}: needs a named primary reaction subject`);
    const before={position:subject.position.clone(),rotation:subject.rotation.clone(),scale:subject.scale.clone(),visible:subject.visible};
    stand.userData.poke();for(let i=1;i<=16;i++)stand.userData.tick(i*.1,.1);
    const moved=subject.position.distanceTo(before.position);
    assert.ok(moved>=minTravel,`${id}: modeled food must travel at least ${minTravel} units when the 1.6 second approach arrives`);
    for(let i=17;i<=21;i++)stand.userData.tick(i*.1,.1);
    const held=!subject.position.equals(before.position)||!subject.rotation.equals(before.rotation)||!subject.scale.equals(before.scale)||subject.visible!==before.visible;
    assert.ok(held,`${id}: primary reaction must remain readable while the paper fade begins`);
  }
  const {turkeyBazaar}=await import(pathToFileURL(join(temp,'town.mjs'))),market=turkeyBazaar(),produce=market.getObjectByName('market-offered-produce');
  const produceStart=produce.position.clone(),marketPieces=[];produce.traverse(o=>{if(o.name==='market-reacting-produce')marketPieces.push([o,o.position.clone()])});
  assert.equal(marketPieces.length,3,'market nominates three readable produce pieces');
  market.userData.poke();for(let i=1;i<=16;i++)market.userData.tick(i*.1,.1);
  assert.deepEqual(produce.position.toArray(),produceStart.toArray(),'market basket remains grounded');
  assert.ok(marketPieces.every(([o,p])=>o.position.distanceTo(p)>=.30),'three produce pieces hop visibly above their grounded basket');
  for(const id of ['turkeyTeaGarden','turkeyDoner','turkeyFish','turkeyGozleme','turkeyBaklava','turkeyBreakfast','turkeyMeze','turkeySupper','turkeyHammam','turkishCat']){
    const stand=TURKEY_PROPS[id]();stand.userData.poke();const geometryCount=()=>stand.children.filter(o=>!o.element).length,count=geometryCount();
    const root=stand.matrix.clone();for(let i=0;i<40;i++){stand.userData.poke();stand.userData.tick(i/60,1/60);}
    for(let i=0;i<240;i++)stand.userData.tick(i/60,1/60);
    stand.updateMatrix();assert.deepEqual(stand.matrix.elements,root.elements,`${id}: root stays grounded`);
    assert.equal(geometryCount(),count,`${id}: repeat taps reuse geometry`);
  }
  doner.userData.poke();doner.userData.tick(.15,.15);const slice=doner.getObjectByName('doner-slice'),sliceY=slice.position.y;
  doner.userData.tick(.65,.5);assert.ok(slice.visible&&slice.position.y<sliceY,'slice falls toward bread');
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
    grove.updateMatrixWorld(true);
    const firstY=drops.map(o=>o.matrixWorld.elements[13]);
    for(let i=0;i<30;i++)grove.userData.tick(i/60,1/60);grove.updateMatrixWorld(true);
    assert.ok(drops.every((o,i)=>o.matrixWorld.elements[13]<firstY[i]),`${id}: fruit must fall down`);
    for(let i=30;i<96;i++)grove.userData.tick(i/60,1/60);
    assert.ok(drops.some(o=>{const target=o.userData.harvestTarget,current=target.clone().set(o.matrix.elements[12],o.matrix.elements[13],o.matrix.elements[14]);return current.distanceTo(target)>.20;}),`${id}: at least one staggered fruit remains in flight at 1.6 seconds`);
    for(let i=96;i<360;i++)grove.userData.tick(i/60,1/60);
    assert.equal(grove.children.filter(o=>o.name==='harvest-fruit').length,0,'harvest particles must clean up');
    for(let i=0;i<40;i++)grove.userData.poke();
    assert.ok(grove.children.filter(o=>o.name==='harvest-fruit').length<=24,'repeated taps must remain bounded');
  }
  const tea=TURKEY_PROPS.turkeyTeaHill();tea.userData.tick(0,0);
  const bushes=[];tea.traverse(o=>{if(o.name==='tea-bush')bushes.push(o)});
  assert.ok(bushes.length>=20);tea.updateMatrixWorld(true);
  const source=bushes[2].userData.fruits.find(f=>f.visible),sourceWorld=source.matrixWorld.clone();
  tea.userData.poke();tea.updateMatrixWorld(true);
  const released=tea.children.find(o=>o.name==='harvest-fruit');
  assert.ok(released.matrixWorld.elements.every((n,i)=>Math.abs(n-sourceWorld.elements[i])<1e-9),'released leaves preserve their world silhouette');
  tea.userData.tick(.3,.3);
  assert.equal(tea.children.filter(o=>o.name==='harvest-fruit').length,3,'pluck just three tea leaves');
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
  console.log('PASS: stationary shared dishes, one simit, falling döner slice, bounded process cycles, grounded cookware, basket harvest, three tea leaves, and clickable China diamonds.');
} finally {await rm(temp,{recursive:true,force:true})}
