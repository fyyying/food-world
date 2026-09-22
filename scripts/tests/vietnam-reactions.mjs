/**
 * Vietnam stands: the click chain, the 1.6-second camera arrival, bounded repeats and a clean return to rest.
 * Copied from spain-reactions.mjs with the Vietnamese ids of docs/vietnam-world.md's fixed blueprint.
 */
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'rolldown';
import * as THREE from 'three';
const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):key==='measureText'?()=>({width:20}):()=>{},set:()=>true});
globalThis.document={visibilityState:'hidden',defaultView:{Element:class {}},createElement:()=>({ownerDocument:document,getContext:()=>ctx,style:{},setAttribute(){},classList:{add(){},remove(){},toggle(){}},addEventListener(){}})};
const temp=await mkdtemp(join(tmpdir(),'vietnam-reactions-'));
try{
  await build({input:{props:'src/fw/props-vietnam.ts',objects:'src/fw/vietnam-objects.ts'},platform:'node',output:{dir:temp,format:'esm',entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs',banner:'import.meta.env={VITE_STATIC:"1",BASE_URL:"/"};'}});
  const props=await import(pathToFileURL(join(temp,'props.mjs')));
  const {VIETNAM_PROPS,VIETNAM_ICONS,VN_LINES}=props;
  const {VIETNAM_OBJECTS}=await import(pathToFileURL(join(temp,'objects.mjs')));

  // Every prop name in the fixed blueprint has a stand, and nothing else is exported as one.
  const rooms=['phoGanhVn','bunChaGrillVn','banhCuonSteamerVn','comCourtyardVn','bunBoHueVn','hueCakeVn','caoLauShopVn','miQuangShopVn','breadPateCartVn','huTieuShopVn','banhXeoHearthVn','mekongHomeVn'];
  const stops=['riceFormsVn','chickenYardVn','herbTraysVn','phuQuocBarrelsVn','phoSpiceTrayVn','lemongrassBasketVn','riverFishBasketVn','lotusTeaTrayVn','caPheStallVn'];
  const landmarks=['hoanKiemVn','streetCarriersVn','stiltHomesVn','hueGateVn','hoiAnQuayVn','waterPuppetsVn','benThanhVn'];
  const expected=[...rooms,...stops,...landmarks];
  assert.deepEqual(Object.keys(VIETNAM_PROPS).sort(),[...expected].sort(),'VIETNAM_PROPS holds one stand per prop name in docs/vietnam-world.md');
  assert.equal(expected.length,28,'28 stands: 12 rooms, 9 ingredient and flavour stops, 7 landmarks');
  // The Stage A decision: `motorbikes` keeps its id and is shown as street carriers. No motorbike is built anywhere.
  const source=await readFile('src/fw/props-vietnam.ts','utf8');
  assert.ok(!/motorbike(?!s)/i.test(source),'no motorbike is built in Vietnam: only the object id `motorbikes` survives, displayed as street carriers');
  assert.ok(!/from\s+["']\.\/props-seasia["']/.test(source),'the Vietnamese stands are rebuilt here, not imported from props-seasia.ts');

  // The twelve room objects each have a card badge, and every one of the 28 object ids has speech lines.
  const roomIds=['hanoiKitchen','bunChaVn','banhCuonVn','comVongVn','hueKitchenVn','banhHueVn','caoLauVn','miQuangVn','banhMi','huTieuVn','banhXeoVn','mekongKitchenVn'];
  for(const id of roomIds){
    assert.ok(typeof VIETNAM_ICONS[id]==='function',`${id}: needs a rendered card badge`);
    assert.ok(VIETNAM_ICONS[id]().children.length>0,`${id}: the badge must model something`);
  }
  const ids=[...roomIds,'riceSea','chickenSea','herbsSea','fishSauce','starAniseVn','lemongrassVn','riverFishVn','lotusTeaVn','caPheVn','hoanKiem','motorbikes','stilts','hueCitadelVn','hoiAnQuayVn','waterPuppetsVn','benThanhVn'];
  assert.equal(ids.length,28,'12 rooms, 9 ingredient and flavour stops and 7 landmarks carry ambient speech');
  assert.equal(VIETNAM_OBJECTS.length,28,'the object list carries the same twenty-eight objects');
  assert.deepEqual(VIETNAM_OBJECTS.map(o=>o.prop).sort(),[...expected].sort(),'every registered object points at a stand in this file');
  for(const id of ids){
    const lines=VN_LINES[id];
    assert.ok(Array.isArray(lines)&&lines.length>=4&&lines.length<=8,`${id}: four to eight ambient speech lines, found ${lines?.length}`);
    // The Vietnamese and its English come on one line, separated by the end of the first sentence.
    assert.ok(lines.filter(l=>/[.!?]["»]?\s+\S/.test(l)).length>=3,`${id}: at least three lines carry Vietnamese and English on one line`);
  }

  const bubbleCount=root=>{let count=0;root.traverse(o=>{if(o.element?.className==='bubble')count++;});return count;};
  const worldMatrix=(root,name)=>{const o=root.getObjectByName(name);assert.ok(o,`missing named reacting subject ${name}`);root.updateMatrixWorld(true);return o.matrixWorld.elements.slice();};
  const run=(stand,seconds,poke)=>{if(poke)stand.userData.poke();for(let i=1;i<=Math.round(seconds/.1);i++)stand.userData.tick(i*.1,.1);return stand;};

  // 1. The food moves before anyone speaks, and the speech arrives after the physical response.
  const ordered=props.phoGanhVn(),ladle=ordered.getObjectByName('pho-ladle'),ladleY=ladle.position.y;
  ordered.userData.poke();assert.equal(bubbleCount(ordered),0,'speech waits for the broth');
  ordered.userData.tick(.1,.1);assert.notEqual(ladle.position.y,ladleY,'the ladle lifts on the first reaction frame');
  assert.equal(bubbleCount(ordered),0,'speech stays subordinate during the first beat');
  ordered.userData.tick(.4,.3);assert.equal(bubbleCount(ordered),1,'speech follows the physical response');

  // 2. Every stand owns its reaction, and its named subject is still visibly changed when the camera arrives at 1.6 s.
  const subjects={phoGanhVn:'pho-ladle',bunChaGrillVn:'bun-cha-clamp',banhCuonSteamerVn:'banh-cuon-sheet',comCourtyardVn:'com-pestle',
    bunBoHueVn:'hue-strainer',hueCakeVn:'hue-tray',caoLauShopVn:'cao-lau-noodles',miQuangShopVn:'mi-quang-ladle',breadPateCartVn:'banh-mi-loaf',
    huTieuShopVn:'hu-tieu-basket',banhXeoHearthVn:'banh-xeo-crepe',mekongHomeVn:'mekong-brush',
    riceFormsVn:'rice-winnow',chickenYardVn:'yard-hen',herbTraysVn:'herb-bundle',phuQuocBarrelsVn:'fish-sauce-drip',phoSpiceTrayVn:'spice-anise',
    lemongrassBasketVn:'lemongrass-stalk',riverFishBasketVn:'river-fish-basket',lotusTeaTrayVn:'lotus-leaf',caPheStallVn:'ca-phe-coffee',
    hoanKiemVn:'hoan-kiem-ripple',streetCarriersVn:'carrier-pole',stiltHomesVn:'stilt-bowl',hueGateVn:'hue-flag',hoiAnQuayVn:'hoian-jar',
    waterPuppetsVn:'puppet-dragon',benThanhVn:'ben-thanh-produce'};
  assert.deepEqual(Object.keys(subjects).sort(),[...expected].sort(),'every stand names the subject its click moves');
  for(const [id,name] of Object.entries(subjects)){
    const still=VIETNAM_PROPS[id](),poked=VIETNAM_PROPS[id]();
    assert.equal(poked.userData.ownReaction,true,`${id}: the stand animates itself, no generic bounce`);
    assert.equal(typeof poked.userData.poke,'function',`${id}: a click must do something`);
    poked.userData.poke();
    const quiet=worldMatrix(still,name);
    for(let i=1;i<=16;i++){still.userData.tick(i*.1,.1);poked.userData.tick(i*.1,.1);}
    const moved=worldMatrix(poked,name),rest=worldMatrix(still,name);
    const delta=Math.max(...moved.map((v,i)=>Math.abs(v-rest[i])),...moved.map((v,i)=>Math.abs(v-quiet[i])));
    assert.ok(delta>.02,`${id}: ${name} must still be clearly changed when the camera arrives at 1.6 s (delta ${delta.toFixed(4)})`);
  }

  // 2b. The arrival camera can see the reaction, from either end of its range as well as from the middle.
  // main.ts flies to the object in 1.6 seconds and stops on a horizontal offset of max(8.8, min(18, the larger
  // footprint side x 1.05)) with the eye 1.4 above the anchor's 1.2, and OrbitControls clamps the azimuth to
  // plus or minus 0.75 radians. From each of those three directions a ray to the reacting subject, the stand turned
  // to the rotation vietnam-objects.ts gives it, must reach the subject without meeting another mesh of the same
  // stand: no roof, awning, post, arch or bystander. Five takes each, because the shared rnd() seed moves the
  // figures and the baskets a little on every build.
  const rotOf=Object.fromEntries(VIETNAM_OBJECTS.filter(o=>o.prop).map(o=>[o.prop,o.rot??0]));
  for(const [id,name] of Object.entries(subjects)) for(let take=0;take<5;take++){
    const stand=VIETNAM_PROPS[id]();
    stand.rotation.y=rotOf[id]??0;
    stand.userData.poke();
    for(let i=1;i<=16;i++)stand.userData.tick(i*.1,.1);
    stand.updateMatrixWorld(true);
    const subject=stand.getObjectByName(name);
    assert.ok(subject,`${id}: no ${name} to look at`);
    const own=new Set();subject.traverse(o=>own.add(o));
    const meshes=[];
    stand.traverse(o=>{
      if(!o.isMesh||own.has(o))return;
      let shown=true;for(let a=o;a;a=a.parent){if(!a.visible)shown=false;if(a.material&&(a.material.visible===false||a.material.opacity===0))shown=false;}
      if(shown)meshes.push(o);
    });
    const whole=new THREE.Box3().setFromObject(stand), size=whole.getSize(new THREE.Vector3()), centre=whole.getCenter(new THREE.Vector3());
    const distance=Math.max(8.8,Math.min(18,Math.max(Math.max(2.2,size.x+.4),Math.max(2.2,size.z+.4))*1.05));
    const target=new THREE.Box3().setFromObject(subject).expandByScalar(.05), aim=target.getCenter(new THREE.Vector3());
    for(const azimuth of [-0.75,0,0.75]){
      const eye=new THREE.Vector3(centre.x+Math.sin(azimuth)*distance,1.2+1.4,centre.z+Math.cos(azimuth)*distance);
      const dir=aim.clone().sub(eye),reach=dir.length();dir.normalize();
      const entry=new THREE.Ray(eye,dir).intersectBox(target,new THREE.Vector3());
      const stop=entry?entry.distanceTo(eye):reach;
      const blocked=new THREE.Raycaster(eye,dir,0,Math.max(0,stop-.02)).intersectObjects(meshes,false)[0];
      // VN_DEBUG=1 names the blocker and where it stands, which is what a fix needs
      if(blocked&&process.env.VN_DEBUG){const w=new THREE.Vector3();blocked.object.getWorldPosition(w);const chain=[];for(let b=blocked.object;b;b=b.parent)if(b.name)chain.push(b.name);console.log(`DEBUG ${id} a=${azimuth} blocked by ${chain.join('<')||blocked.object.geometry.type} at (${w.x.toFixed(2)},${w.y.toFixed(2)},${w.z.toFixed(2)}) local(${blocked.object.position.x.toFixed(2)},${blocked.object.position.y.toFixed(2)},${blocked.object.position.z.toFixed(2)}) d=${blocked.distance.toFixed(2)}/${stop.toFixed(2)} aim(${aim.x.toFixed(2)},${aim.y.toFixed(2)},${aim.z.toFixed(2)}) centre(${centre.x.toFixed(2)},${centre.z.toFixed(2)}) D=${distance.toFixed(2)}`);}
      assert.ok(!blocked,`${id}: ${blocked?(blocked.object.name||blocked.object.parent?.name||'a mesh of the stand'):''} hides ${name} from the arrival camera at azimuth ${azimuth} (take ${take})`);
      // and it has to be inside the frame as well as unblocked: main.ts looks through a 34-degree lens, so a
      // subject much above the roofline — a flag on a tower — is off the top of the screen when the flight ends.
      const lens=new THREE.PerspectiveCamera(34,16/9,.1,400);
      lens.position.copy(eye);lens.lookAt(centre.x,1.2,centre.z);lens.updateMatrixWorld(true);
      const frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(lens.projectionMatrix,lens.matrixWorldInverse));
      assert.ok(frustum.containsPoint(aim),`${id}: ${name} is outside the 34-degree arrival frame at azimuth ${azimuth} (aim y ${aim.y.toFixed(2)})`);
    }
  }

  // 3. The pours connect a real lip to a real vessel, and the stream is gone once the reaction has passed.
  for(const [id,name] of [['phoGanhVn','pho-broth-stream'],['miQuangShopVn','mi-quang-stream'],['bunBoHueVn','hue-drain']]){
    const stand=run(VIETNAM_PROPS[id](),1.6,true),liquid=stand.getObjectByName(name);
    assert.ok(liquid,`${id}: needs a modelled ${name}`);
    assert.equal(liquid.visible,true,`${id}: the ${name} must still be running at the 1.6 s arrival`);
    assert.ok(liquid.scale.y>.02,`${id}: the ${name} must span a real distance, not a floating line`);
    for(let i=17;i<=240;i++)stand.userData.tick(i*.1,.1);
    assert.equal(liquid.visible,false,`${id}: the ${name} must stop when the reaction has gone`);
  }
  // The barrel tap and the coffee filter drip on their own clocks, so they are measured while they run.
  for(const [id,name] of [['phuQuocBarrelsVn','fish-sauce-drip'],['caPheStallVn','ca-phe-drip']]){
    const stand=run(VIETNAM_PROPS[id](),1.6,true),liquid=stand.getObjectByName(name);
    assert.ok(liquid,`${id}: needs a modelled ${name}`);
    assert.equal(liquid.visible,true,`${id}: the ${name} must be falling at the 1.6 s arrival`);
    assert.ok(liquid.scale.y>.02,`${id}: the ${name} must span a real distance, not a floating line`);
    // `stream` points its cylinder's own +y down the fall, so the falling direction is the rotated up axis.
    const axis=new THREE.Vector3(0,1,0).applyQuaternion(liquid.getWorldQuaternion(new THREE.Quaternion()));
    assert.ok(axis.y<=-.8,`${id}: the ${name} must fall rather than cross the stand (its axis points ${axis.y.toFixed(2)} down)`);
  }

  // 4. Repeated clicks stay bounded and the grain that is tossed is cleaned up.
  for(const id of ['riceFormsVn']){
    const stand=VIETNAM_PROPS[id](),count=stand.children.length;
    for(let i=0;i<40;i++)stand.userData.poke();
    assert.ok(stand.children.length<=count+24,`${id}: repeated clicks must remain bounded`);
    for(let i=0;i<300;i++)stand.userData.tick(10+i/60,1/60);
    assert.equal(stand.children.length,count,`${id}: the tossed grain must clean up`);
  }

  // 5. Everything that moves returns to its exact support, and the people never leave theirs.
  const settling={phoGanhVn:'pho-ladle',bunChaGrillVn:'bun-cha-clamp',banhCuonSteamerVn:'banh-cuon-sheet',comCourtyardVn:'com-pestle',
    bunBoHueVn:'hue-strainer',hueCakeVn:'hue-tray',caoLauShopVn:'cao-lau-noodles',miQuangShopVn:'mi-quang-ladle',breadPateCartVn:'banh-mi-loaf',
    huTieuShopVn:'hu-tieu-basket',banhXeoHearthVn:'banh-xeo-crepe',herbTraysVn:'herb-bundle',lemongrassBasketVn:'lemongrass-stalk',
    riverFishBasketVn:'river-fish-basket',stiltHomesVn:'stilt-bowl',hoiAnQuayVn:'hoian-jar',waterPuppetsVn:'puppet-dragon',benThanhVn:'ben-thanh-produce'};
  for(const [id,name] of Object.entries(settling)){
    const stand=VIETNAM_PROPS[id](),subject=stand.getObjectByName(name);
    stand.userData.tick(0,0);subject.updateMatrix();const start=subject.matrix.clone();
    for(let i=0;i<6;i++){stand.userData.poke();for(let k=0;k<20;k++)stand.userData.tick((i*20+k)/60,1/60);}
    for(let i=0;i<300;i++)stand.userData.tick(10+i/60,1/60);
    subject.updateMatrix();
    assert.deepEqual(subject.matrix.elements,start.elements,`${id}: ${name} settles exactly, without drift after repeated clicks`);
  }
  for(const id of expected){
    const stand=VIETNAM_PROPS[id]();
    const roots=stand.children.filter(o=>o.userData.upper).map(o=>[o,o.position.y]);
    stand.userData.poke();stand.userData.tick(.2,.2);
    assert.ok(roots.every(([o,y])=>Math.abs(o.position.y-y)<1e-9),`${id}: people stay on their supports`);
  }

  // 5b. Every lamp hangs from a beam within reach, and its cord stays on the anchor while it swings.
  for(const id of expected){
    const root=VIETNAM_PROPS[id]();root.updateMatrixWorld(true);
    const meshes=[],lanterns=[];
    root.traverse(o=>{if(o.isMesh)meshes.push(o);if(o.name==='hanging-lantern')lanterns.push(o);});
    for(const lantern of lanterns){
      const anchor=lantern.localToWorld(lantern.userData.suspensionPoint.clone());
      let gap=Infinity;
      for(const mesh of meshes){
        let own=false;for(let a=mesh;a;a=a.parent)if(a===lantern)own=true;
        if(own)continue;
        mesh.geometry.computeBoundingBox();
        gap=Math.min(gap,mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld).distanceToPoint(anchor));
      }
      assert.ok(gap<=.10,`${id}: a lamp hangs in the air, ${gap.toFixed(3)} from any support`);
      const swing=lantern.children[0];
      for(const time of [0,1,7,19]){
        lantern.userData.tick(time,.016);root.updateMatrixWorld(true);
        const cord=swing.children.at(-1);cord.geometry.computeBoundingBox();
        const top=cord.localToWorld(cord.position.clone().set(0,cord.geometry.boundingBox.max.y,0));
        assert.ok(top.distanceTo(anchor)<1e-7,`${id}: a lamp cord drifts off its anchor while it sways`);
      }
    }
  }

  // 5c. Nothing sinks through the ground the stand stands on.
  for(const id of expected){
    const root=VIETNAM_PROPS[id]();root.userData.tick(0,0);root.updateMatrixWorld(true);
    let lowest=Infinity,culprit='';
    root.traverse(o=>{if(!o.isMesh)return;let shown=true;for(let a=o;a;a=a.parent)if(!a.visible)shown=false;if(!shown)return;o.geometry.computeBoundingBox();const y=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld).min.y;if(y<lowest){lowest=y;culprit=o.name||o.parent?.name||'mesh';}});
    assert.ok(lowest>=-.35,`${id}: ${culprit} sinks to ${lowest.toFixed(2)} below the ground`);
  }

  // 6. The main stands carry the hotpot table: modelled food, six to nine people, a beam with lamps, steam at a hot source.
  // Every Vietnamese room has a fire, a steamer or a boiling pot except the green-rice courtyard, which is pounded cold.
  const cold=['comCourtyardVn'];
  for(const id of rooms){
    const stand=VIETNAM_PROPS[id]();let people=0,lanterns=0,beams=0;
    stand.traverse(o=>{if(o.userData.upper)people++;if(o.name==='hanging-lantern')lanterns++;if(o.name==='front-beam')beams++;});
    assert.ok(people>=6&&people<=9,`${id}: six to nine people, found ${people}`);
    assert.ok(lanterns>=2,`${id}: lamps hang under the beam, found ${lanterns}`);
    assert.ok(beams>=1,`${id}: the lamps need a beam to hang from`);
    if(!cold.includes(id))assert.ok(stand.userData.steam,`${id}: a hot source needs a steam point`);
  }
  for(const id of cold)assert.equal(VIETNAM_PROPS[id]().userData.steam,undefined,`${id}: nothing here is hot, so nothing steams`);
  // The stops and the landmarks are simpler, but every one of them has someone at it and something modelled.
  for(const id of [...stops,...landmarks]){
    const stand=VIETNAM_PROPS[id]();let people=0,meshes=0;
    stand.traverse(o=>{if(o.userData.upper)people++;if(o.isMesh)meshes++;});
    assert.ok(people>=1&&people<=6,`${id}: one to six people at a stop or a landmark, found ${people}`);
    assert.ok(meshes>=20,`${id}: a stop still models a real place, found ${meshes} meshes`);
  }

  console.log('PASS: 28 Vietnam stands, food before speech, a clear sight line from the arrival camera, pours on real lips and an exact return to rest.');
}finally{await rm(temp,{recursive:true,force:true});}
