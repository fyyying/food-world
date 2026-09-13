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
  const rooms=world.placed.filter(p=>p.obj.scene);
  assert.equal(rooms.length,15);assert.equal(new Set(rooms.map(p=>p.obj.scene)).size,15);
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
  // Sample the complete centreline, including places a walker might not reach during a short preview.
  for(const lane of MIDEAST_LANES)for(let i=0;i<=250;i++){
    const u=i/250,x=lane.from[0]+(lane.to[0]-lane.from[0])*u,z=lane.from[1]+(lane.to[1]-lane.from[1])*u;
    for(const [dx,dz] of [[-.8,-.8],[.8,-.8],[-.8,.8],[.8,.8]]) assert.ok(inPoly(x+dx,z+dz,LAND_SHORE)&&!inPoly(x+dx,z+dz,river),`${lane.id}: road reaches water`);
    for(const {b,owner,root} of obstacles)if(!(root.name==='river-bridge'&&lane.id.startsWith('bridge-'))&&x>b.min.x-.24&&x<b.max.x+.24&&z>b.min.z-.24&&z<b.max.z+.24)collisions.add(`${lane.id}: ${owner} at ${b.min.x.toFixed(1)},${b.min.z.toFixed(1)} to ${b.max.x.toFixed(1)},${b.max.z.toFixed(1)}`);
  }
  assert.deepEqual([...collisions],[],'walking route intersects an object at body height');
  const sitters=[];world.group.traverse(o=>{if(o.name==='turkey-sitter')sitters.push(o)});
  const vendors=[];world.group.traverse(o=>{if(o.name==='turkish-market-vendor')vendors.push(o)});
  assert.equal(sitters.length,22);
  assert.equal(vendors.length,6);
  const trams=world.group.children.filter(o=>o.name==='istanbul-tram');assert.equal(trams.length,2);
  // Separating-axis test of a carriage rectangle and each solid obstacle at body height.
  const hits=(car,b)=>{const a=-car.rotation.y,ux=Math.cos(a),uz=Math.sin(a),vx=-uz,vz=ux;const dx=(b.min.x+b.max.x)/2-car.position.x,dz=(b.min.z+b.max.z)/2-car.position.z,ex=(b.max.x-b.min.x)/2,ez=(b.max.z-b.min.z)/2;return Math.abs(dx)<ex+1.83*Math.abs(ux)+.69*Math.abs(vx)&&Math.abs(dz)<ez+1.83*Math.abs(uz)+.69*Math.abs(vz)&&Math.abs(dx*ux+dz*uz)<1.83+ex*Math.abs(ux)+ez*Math.abs(uz)&&Math.abs(dx*vx+dz*vz)<.69+ex*Math.abs(vx)+ez*Math.abs(vz);};
  const tramCollisions=new Set();
  const food=[];world.group.traverse(o=>{if(o.userData.foodReaction)food.push({o,y:o.position.y})});assert.ok(food.length>20,'food needs visible tap reactions');
  let foodMoved=false;const balloonYs=[];
  // Trigger the same reactions as a tap, then exercise real delta time as well as elapsed time.
  for(const room of rooms)world.poke(room);
  for(let frame=0;frame<1200;frame++){
    world.tick(frame*.2,.2);world.group.updateMatrixWorld(true);
    foodMoved ||= food.some(({o,y})=>o.position.y>y+.1);
    balloonYs.push(world.group.children.find(o=>o.name==='cappadocia-balloon').position.y);
    for(const sitter of sitters){
      const pelvis=sitter.children.find(o=>o.isMesh);pelvis.geometry.computeBoundingBox();
      const b=pelvis.geometry.boundingBox.clone().applyMatrix4(pelvis.matrixWorld);
      const seat=sitter.userData.seat;seat.geometry.computeBoundingBox();const sb=seat.geometry.boundingBox.clone().applyMatrix4(seat.matrixWorld);
      assert.ok(Math.abs(b.min.y-sb.max.y)<1e-6,'sitter left the stool');
    }
    for(const w of walkers)assert.ok(Math.abs(w.position.y-.034)<1e-6,'walker left the ground');
    for(const v of vendors)assert.equal(v.position.y,.02,'market vendor left the ground');
    for(const car of trams)for(const {b,owner} of obstacles) if(hits(car,b))tramCollisions.add(`${owner} at ${b.min.x.toFixed(1)},${b.min.z.toFixed(1)} (car ${car.position.x.toFixed(1)},${car.position.z.toFixed(1)})`);
    for(const car of trams)for(const walker of walkers){const b={min:{x:walker.position.x-.18,z:walker.position.z-.18},max:{x:walker.position.x+.18,z:walker.position.z+.18}};if(hits(car,b))tramCollisions.add(`walker ${walker.userData.lane}`);}
    const ferries=world.group.children.filter(o=>o.name==='bosphorus-ferry');
    assert.ok(ferries[0].position.distanceTo(ferries[1].position)>1.4,'ferries overlap');
    for(const f of ferries){
      assert.ok(f.position.x-1.6>=-62&&f.position.x+1.6<=-12,'ferry leaves the channel');
      assert.ok(f.position.z-.65>=-52&&f.position.z+.65<=-46,'ferry reaches the bank');
    }
  }
  assert.ok(foodMoved,'food did not react');for(const {o,y} of food)assert.ok(Math.abs(o.position.y-y)<1e-6,'food did not settle');
  assert.ok(Math.max(...balloonYs)-Math.min(...balloonYs)>1.5,'balloons barely move');
  assert.deepEqual([...tramCollisions],[],'tram reaches an obstacle');
  console.log(`PASS: 15 rooms, 57 images, ${MIDEAST_LANES.length} unobstructed lanes, ${walkers.length} walkers, ${sitters.length} supported diners, 240 seconds of motion.`);
}finally{await rm(temp,{recursive:true,force:true})}
