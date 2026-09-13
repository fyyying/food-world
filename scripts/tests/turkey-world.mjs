import assert from 'node:assert/strict';
import { mkdtemp, rm, access, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';
const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):key==='measureText'?()=>({width:20}):()=>{},set:()=>true});
globalThis.document={visibilityState:'hidden',defaultView:{Element:class {}},createElement:()=>({ownerDocument:document,getContext:()=>ctx,style:{},setAttribute(){},classList:{add(){},remove(){},toggle(){}},addEventListener(){}})};
globalThis.Image=class { complete=true;naturalWidth=24;naturalHeight=14;set src(_){} };
const sampleMotion=(scene,portrait)=>{
  const count={gradients:0,ellipses:0,images:0,svg:scene.layers.some(layer=>/class="sway"|id="(?:fire|lamp)-/.test(layer.svg))?1:0};
  const fxCtx=new Proxy({}, {get:(_,key)=>key==='createRadialGradient'?()=>{count.gradients++;return {addColorStop(){}}}:key==='ellipse'?()=>{count.ellipses++}:key==='drawImage'?()=>{count.images++}:()=>{},set:()=>true});
  for(let frame=0;frame<60;frame++)scene.fx(fxCtx,frame*.2,.2,portrait);
  return count;
};
const temp=await mkdtemp(join(tmpdir(),'turkey-world-'));
try {
  await build({input:{world:'src/fw/world-mideast.ts',rooms:'src/fw/scenes-turkey.ts',objects:'src/fw/turkey-objects.ts',landscape:'src/fw/turkey-landscape.ts'},platform:'node',output:{banner:'import.meta.env={VITE_STATIC:"1",BASE_URL:"/"};',dir:temp,format:'esm',entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs'}});
  const {buildMideast,MIDEAST_LANES}=await import(pathToFileURL(join(temp,'world.mjs')));
  const {TURKEY_SCENES}=await import(pathToFileURL(join(temp,'rooms.mjs')));
  const {TURKEY_NEXT}=await import(pathToFileURL(join(temp,'objects.mjs')));
  const {LAND_SHORE,waterOutline}=await import(pathToFileURL(join(temp,'landscape.mjs')));
  const inPoly=(x,z,poly)=>{let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [ax,az]=poly[i],[bx,bz]=poly[j];if((az>z)!==(bz>z)&&x<(bx-ax)*(z-az)/(bz-az)+ax)yes=!yes;}return yes;};
  const river=waterOutline();
  const world=buildMideast([]);world.group.updateMatrixWorld(true);
  // At a route turn the old cosine movement almost stopped, while the legs kept marching.
  const quayWalker=world.group.children.find(o=>o.name==='lane-walker'&&o.userData.lane==='quay');
  const thigh=quayWalker.userData.legs.left.thigh;
  world.tick(0,0);
  let inPlaceSteps=0;
  for(let frame=1;frame<=5;frame++){
    const before=quayWalker.position.clone(),angle=thigh.rotation.x;
    world.tick(frame*.05,.05);
    if(quayWalker.position.distanceTo(before)<.002&&Math.abs(thigh.rotation.x-angle)>.01)inPlaceSteps++;
  }
  assert.equal(inPlaceSteps,0,'a nearly stationary walker must not keep taking full steps');
  const rooms=world.placed.filter(p=>p.obj.scene);
  assert.equal(rooms.length,15);assert.equal(new Set(rooms.map(p=>p.obj.scene)).size,15);
  // The town's visual anchors must also be discoverable through the normal object/card flow.
  for(const id of ['mosqueTr','ottomanTr','waterfrontTr','cappadociaTr','hammamTr','fountainTr','donerTr','gozlemeTr']){
    const p=world.placed.find(p=>p.obj.id===id);
    assert.ok(p,`${id}: missing explorable Turkish landmark`);
    assert.ok(p.obj.blurb.length>180,`${id}: missing cultural context`);
    assert.ok(p.hit.geometry && p.anchor.toArray().every(Number.isFinite));
  }
  let fallingLeafRooms=0,driftingFlakeRooms=0;
  for(const [from,links] of Object.entries(TURKEY_NEXT)){
    assert.ok(world.placed.some(p=>p.obj.id===from));
    for(const id of links)assert.ok(rooms.some(p=>p.obj.id===id),`${from}: unknown next destination ${id}`);
  }
  for(const {obj} of rooms){
    assert.ok(TURKEY_SCENES[obj.scene],`${obj.id}: missing room`);
    const room=TURKEY_SCENES[obj.scene]();assert.ok(room.hotspots.length>=3);
    for(const portrait of [false,true]){
      const motion=sampleMotion(TURKEY_SCENES[obj.scene](),portrait);
      assert.ok(Object.values(motion).some(Boolean),`${obj.scene}: painting has no visible ${portrait?'phone':'wide'} ambient motion`);
      if(!portrait){fallingLeafRooms+=Number(motion.images>0);driftingFlakeRooms+=Number(motion.ellipses>0);}
    }
    for(const h of room.hotspots){
      for(const p of [h.interaction.wide,h.interaction.phone]) assert.ok(p.every(n=>n>0&&n<1));
      if(h.interaction.food)await access(`public/scenes/turkey-food/${h.interaction.food}.webp`);
    }
    for(const layer of room.layers)for(const m of layer.svg.matchAll(/<image[^>]*href="([^"]+)"/g))await access(join('public',m[1]));
  }
  assert.ok(fallingLeafRooms>=2,'Turkey needs falling leaves as well as smoke and steam');
  assert.ok(driftingFlakeRooms>=5,'Turkey needs subtle drifting foliage and flour in its painted scenes');
  const manifest=JSON.parse(await readFile('public/scenes/turkey-assets.json','utf8'));
  assert.equal(manifest.length,57);for(const a of manifest)await access(join('public',a.path));
  const lanes=world.group.children.filter(o=>o.name==='walking-lane');
  for(const road of lanes){
    const lane=road.userData.lane,half=Math.hypot(lane.to[0]-lane.from[0],lane.to[1]-lane.from[1])/2;
    const ends=[-half,half].map(y=>road.position.clone().set(0,y,0).applyMatrix4(road.matrixWorld));
    for(const [x,z] of [lane.from,lane.to]) assert.ok(ends.some(p=>Math.hypot(p.x-x,p.z-z)<1e-5),`${lane.id}: visible road does not reach its junction`);
  }
  const walkers=world.group.children.filter(o=>o.name==='lane-walker');
  assert.equal(lanes.length,MIDEAST_LANES.length);assert.ok(walkers.length>=25);
  const turkishWalkers=walkers.filter(o=>o.userData.turkishResident);
  assert.ok(turkishWalkers.length>=40,'all Turkish lanes need the new residents');
  assert.ok(new Set(turkishWalkers.map(o=>o.userData.dress)).size>=4,'street clothing needs distinct silhouettes');
  assert.ok(new Set(turkishWalkers.map(o=>o.userData.pace)).size>=6,'residents need different paces');
  const motionChecks=[];
  world.group.traverse(o=>{if(o.userData.turkishResident&&o.userData.tick){
    const shoes=Object.values(o.userData.legs).map(l=>l.shin.children.find(c=>c.isMesh&&c.geometry.type==='BoxGeometry'));
    motionChecks.push({o,shoes,last:o.position.clone(),stopped:0,walking:0,paused:0});
  }});
  const obstacles=[];
  for(const root of world.group.children){
    if(root.name==='tram-coupling'||root.name==='istanbul-tram'||root.name==='lane-walker'||root.name==='bosphorus-ferry'||root.name==='cappadocia-balloon'||root.userData.placed)continue;
    root.traverse(o=>{
      if(!o.isMesh||o.material?.visible===false||o.material?.opacity===0)return;
      o.geometry.computeBoundingBox();const b=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
      // Walkers' bodies occupy this height band; ground, water, roofs and high foliage do not.
      if(b.max.y>.16&&b.min.y<1.35) obstacles.push({b,root,owner:world.placed.find(p=>p.group===root)?.obj.id??root.name??'scenery'});
    });
  }
  const collisions=new Set();
  const houses=world.group.children.filter(o=>o.name==='turkish-lane-house');
  assert.ok(new Set(houses.map(h=>h.userData.houseStyle)).size>=5,'the town needs different house forms');
  assert.ok(houses.some(h=>h.userData.storeys===3)&&houses.some(h=>h.userData.storeys===1),'roof heights must vary');
  // Denser streets must not strand a stationary neighbour inside the new buildings.
  for(const p of world.group.children.filter(o=>o.name==='turkish-square-neighbour')){
    for(const {b,root,owner} of obstacles){
      if(root.name==='turkish-square-neighbour'||root===p)continue;
      if(p.position.x>b.min.x-.08&&p.position.x<b.max.x+.08&&p.position.z>b.min.z-.08&&p.position.z<b.max.z+.08)collisions.add(`neighbour ${p.position.x},${p.position.z}: ${owner}`);
    }
  }
  // Sample the complete centreline, including places a walker might not reach during a short preview.
  for(const lane of MIDEAST_LANES)for(let i=0;i<=250;i++){
    const u=i/250,x=lane.from[0]+(lane.to[0]-lane.from[0])*u,z=lane.from[1]+(lane.to[1]-lane.from[1])*u;
    for(const [dx,dz] of [[-.8,-.8],[.8,-.8],[-.8,.8],[.8,.8]]) assert.ok(inPoly(x+dx,z+dz,LAND_SHORE)&&!inPoly(x+dx,z+dz,river),`${lane.id}: road reaches water`);
    const radius=lane.walkers>0&&lane.from[1]<15&&lane.to[1]<15?.38:.24;
    for(const {b,owner,root} of obstacles)if(!(root.name==='river-bridge'&&lane.id.startsWith('bridge-'))&&x>b.min.x-radius&&x<b.max.x+radius&&z>b.min.z-radius&&z<b.max.z+radius)collisions.add(`${lane.id}: ${owner} at ${b.min.x.toFixed(1)},${b.min.z.toFixed(1)} to ${b.max.x.toFixed(1)},${b.max.z.toFixed(1)}`);
  }
  assert.deepEqual([...collisions],[],'walking route intersects an object at body height');
  const sitters=[];world.group.traverse(o=>{if(o.name==='turkey-sitter')sitters.push(o)});
  const vendors=[];world.group.traverse(o=>{if(o.name==='turkish-market-vendor')vendors.push(o)});
  assert.equal(sitters.length,26);
  assert.equal(vendors.length,6);
  const trams=world.group.children.filter(o=>o.name==='istanbul-tram');assert.equal(trams.length,2);
  // Separating-axis test of a carriage rectangle and each solid obstacle at body height.
  const hits=(car,b)=>{const a=-car.rotation.y,ux=Math.cos(a),uz=Math.sin(a),vx=-uz,vz=ux;const dx=(b.min.x+b.max.x)/2-car.position.x,dz=(b.min.z+b.max.z)/2-car.position.z,ex=(b.max.x-b.min.x)/2,ez=(b.max.z-b.min.z)/2;return Math.abs(dx)<ex+1.83*Math.abs(ux)+.69*Math.abs(vx)&&Math.abs(dz)<ez+1.83*Math.abs(uz)+.69*Math.abs(vz)&&Math.abs(dx*ux+dz*uz)<1.83+ex*Math.abs(ux)+ez*Math.abs(uz)&&Math.abs(dx*vx+dz*vz)<.69+ex*Math.abs(vx)+ez*Math.abs(vz);};
  const tramCollisions=new Set();
  const food=[];world.group.traverse(o=>{if(o.userData.foodReaction)food.push({o,y:o.position.y})});assert.ok(food.length>20,'food needs visible tap reactions');
  let foodMoved=false;const balloonYs=[];
  // Trigger the same reactions as a tap, then exercise real delta time as well as elapsed time.
  for(const room of [...rooms,...world.placed.filter(p=>['donerTr','gozlemeTr'].includes(p.obj.id))])world.poke(room);
  const doner=world.group.getObjectByName('doner-meat'),griddle=world.group.getObjectByName('gozleme-griddle');
  assert.ok(doner&&griddle,'new street kitchens must be present');
  const griddleY=griddle.position.y,donerAngles=[];
  for(let frame=0;frame<1200;frame++){
    world.tick(frame*.2,.2);world.group.updateMatrixWorld(true);
    assert.equal(griddle.position.y,griddleY,'the griddle must stay on its stand during a food reaction');
    if(frame>100)donerAngles.push(doner.rotation.y);
    foodMoved ||= food.some(({o,y})=>o.position.y>y+.1);
    balloonYs.push(world.group.children.find(o=>o.name==='cappadocia-balloon').position.y);
    for(const sitter of sitters){
      const pelvis=sitter.children.find(o=>o.isMesh);pelvis.geometry.computeBoundingBox();
      const b=pelvis.geometry.boundingBox.clone().applyMatrix4(pelvis.matrixWorld);
      const seat=sitter.userData.seat;seat.geometry.computeBoundingBox();const sb=seat.geometry.boundingBox.clone().applyMatrix4(seat.matrixWorld);
      assert.ok(Math.abs(b.min.y-sb.max.y)<1e-6,'sitter left the stool');
    }
    for(const w of walkers)assert.ok(Math.abs(w.position.y-.034)<1e-6,'walker left the ground');
    for(const sample of motionChecks){
      const {o,shoes}=sample,moved=o.position.distanceTo(sample.last);sample.last.copy(o.position);
      sample.stopped=moved<1e-7?sample.stopped+1:0;
      if(frame>1&&sample.stopped>=2){
        sample.paused++;
        for(const leg of Object.values(o.userData.legs))assert.ok(Math.abs(leg.thigh.rotation.x)<1e-8&&Math.abs(leg.shin.rotation.x)<1e-8,'a paused resident is still stepping');
      }else if(frame>1&&moved>.01){sample.walking++;assert.ok(o.userData.isWalking,'moving resident has a frozen gait');}
      const soles=shoes.map(shoe=>{shoe.geometry.computeBoundingBox();return shoe.geometry.boundingBox.clone().applyMatrix4(shoe.matrixWorld).min.y;});
      const floor=o.position.clone().set(0,0,0).applyMatrix4(o.matrixWorld).y;
      assert.ok(Math.abs(Math.min(...soles)-floor)<1e-6,'resident shoes lost contact with their walking surface');
    }
    for(const v of vendors)assert.equal(v.position.y,.02,'market vendor left the ground');
    for(const car of trams)for(const {b,owner} of obstacles) if(hits(car,b))tramCollisions.add(`${owner} at ${b.min.x.toFixed(1)},${b.min.z.toFixed(1)} (car ${car.position.x.toFixed(1)},${car.position.z.toFixed(1)})`);
    for(const car of trams)for(const walker of walkers){const radius=walker.userData.turkishResident?.38:.18,b={min:{x:walker.position.x-radius,z:walker.position.z-radius},max:{x:walker.position.x+radius,z:walker.position.z+radius}};if(hits(car,b))tramCollisions.add(`walker ${walker.userData.lane}`);}
    const ferries=world.group.children.filter(o=>o.name==='bosphorus-ferry');
    assert.ok(ferries[0].position.distanceTo(ferries[1].position)>1.4,'ferries overlap');
    for(const f of ferries){
      assert.ok(f.position.x-1.6>=-62&&f.position.x+1.6<=-12,'ferry leaves the channel');
      assert.ok(f.position.z-.65>=-52&&f.position.z+.65<=-46,'ferry reaches the bank');
    }
  }
  assert.ok(foodMoved,'food did not react');for(const {o,y} of food)assert.ok(Math.abs(o.position.y-y)<1e-6,'food did not settle');
  assert.ok(donerAngles.at(-1)-donerAngles[0]>1,'the döner must keep turning after the tap reaction');
  assert.ok(Math.max(...balloonYs)-Math.min(...balloonYs)>1.5,'balloons barely move');
  assert.deepEqual([...tramCollisions],[],'tram reaches an obstacle');
  for(const o of turkishWalkers){const sample=motionChecks.find(s=>s.o===o);assert.ok(sample.walking>0&&sample.paused>0,`${o.userData.lane}: resident must both walk and stop`);}
  const shoppers=motionChecks.filter(s=>!walkers.includes(s.o)&&s.walking>0);
  assert.equal(shoppers.length,3,'the bazaar needs three moving shoppers');
  assert.ok(shoppers.every(s=>s.paused>0),'market shoppers must stop stepping while browsing');
  console.log(`PASS: 15 rooms, 57 images, ${MIDEAST_LANES.length} unobstructed lanes, ${walkers.length} walkers, ${sitters.length} supported diners, 240 seconds of motion.`);
}finally{await rm(temp,{recursive:true,force:true})}
