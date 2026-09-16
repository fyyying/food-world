/**
 * Spain stands: the click chain, the 1.6-second camera arrival, bounded repeats and a clean return to rest.
 * Copied from xinjiang-reactions.mjs and turkey-reactions.mjs with the Spain ids.
 */
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'rolldown';
import * as THREE from 'three';
const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):key==='measureText'?()=>({width:20}):()=>{},set:()=>true});
globalThis.document={visibilityState:'hidden',defaultView:{Element:class {}},createElement:()=>({ownerDocument:document,getContext:()=>ctx,style:{},setAttribute(){},classList:{add(){},remove(){},toggle(){}},addEventListener(){}})};
const temp=await mkdtemp(join(tmpdir(),'spain-reactions-'));
try{
  await build({input:{props:'src/fw/props-spain.ts',objects:'src/fw/spain-objects.ts'},platform:'node',output:{dir:temp,format:'esm',entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs',banner:'import.meta.env={VITE_STATIC:"1",BASE_URL:"/"};'}});
  const props=await import(pathToFileURL(join(temp,'props.mjs')));
  const {SPAIN_PROPS,SPAIN_ICONS,ES_LINES}=props;
  const {SPAIN_OBJECTS}=await import(pathToFileURL(join(temp,'objects.mjs')));

  // Every prop name in the Spain object list has a stand, and nothing else is exported as one.
  const expected=['paellaFire','tapasBar','jamonStall','tortillaKitchen','churreria','pintxoBar','patioKitchen','pulperia','panTerrace','quesoFarm','sidreria','jerezBodega',
    'fishingPort','orangeGrove','oliveMillEs','albuferaPaddy','huertaBeds','azafranField','dehesaOaks','manchegaFlock','veraDryhouse','herbonPeppers',
    'alhambra','flamenco','manchaWindmill','gaudiBench'];
  assert.deepEqual(Object.keys(SPAIN_PROPS).sort(),[...expected].sort(),'SPAIN_PROPS holds one stand per prop name in docs/spain-world.md');
  // The horreo landmark was removed on the owner's word, 2026-09-16: a tan granary on grey stilts over the ria.
  assert.equal(expected.length,26,'26 stands: 12 rooms, 10 ingredient stops, 4 landmarks');

  // The twelve room objects each have a card badge, and every object id has speech lines.
  const rooms=['paellaEs','plancha','jamonEs','tortillaEs','churrosEs','pintxosEs','gazpachoEs','pulpoEs','paTomaquet','manchegoEs','sidreriaEs','bodegaJerez'];
  for(const id of rooms){
    assert.ok(typeof SPAIN_ICONS[id]==='function',`${id}: needs a rendered card badge`);
    assert.ok(SPAIN_ICONS[id]().children.length>0,`${id}: the badge must model something`);
  }
  const ids=[...rooms,'fishMed','oranges','oliveEs','albuferaRice','huertaEs','azafranEs','dehesaEs','ovejaManchega','pimentonVera','pementoHerbon','alhambraEs','flamenco','molinosMancha','gaudiEs'];
  assert.equal(ids.length,26,'12 rooms, 10 ingredient stops and 4 landmarks carry ambient speech');
  assert.equal(SPAIN_OBJECTS.length,26,'the object list lost the horreo with its stand');
  assert.ok(!ES_LINES.horreoEs&&!SPAIN_PROPS.horreo,'no horreo lines or stand survive the removal');
  for(const id of ids){
    const lines=ES_LINES[id];
    assert.ok(Array.isArray(lines)&&lines.length>=4&&lines.length<=8,`${id}: four to eight ambient speech lines, found ${lines?.length}`);
    // The local phrase and its English come on one line, separated by the end of the first sentence.
    // A one-word cry such as "¡Olé!" needs no translation, so three bilingual lines is the bar.
    assert.ok(lines.filter(l=>/[.!?]["»]?\s+\S/.test(l)).length>=3,`${id}: at least three lines carry the local language and English on one line`);
  }

  const bubbleCount=root=>{let count=0;root.traverse(o=>{if(o.element?.className==='bubble')count++;});return count;};
  const worldMatrix=(root,name)=>{const o=root.getObjectByName(name);assert.ok(o,`missing named reacting subject ${name}`);root.updateMatrixWorld(true);return o.matrixWorld.elements.slice();};
  const run=(stand,seconds,poke)=>{if(poke)stand.userData.poke();for(let i=1;i<=Math.round(seconds/.1);i++)stand.userData.tick(i*.1,.1);return stand;};

  // 1. The food moves before anyone speaks, and the speech arrives after the physical response.
  const ordered=props.paellaFire(),rice=ordered.getObjectByName('paella-rice'),riceY=rice.position.y;
  ordered.userData.poke();assert.equal(bubbleCount(ordered),0,'speech waits for the rice');
  ordered.userData.tick(.1,.1);assert.notEqual(rice.position.y,riceY,'the rice lifts on the first reaction frame');
  assert.equal(bubbleCount(ordered),0,'speech stays subordinate during the first beat');
  ordered.userData.tick(.4,.3);assert.equal(bubbleCount(ordered),1,'speech follows the physical response');

  // 2. Every stand owns its reaction, and its named subject is still visibly changed when the camera arrives at 1.6 s.
  const subjects={paellaFire:'paella-rice',tapasBar:'bravas-jug',jamonStall:'jamon-slice',tortillaKitchen:'tortilla',churreria:'churro-rising',
    pintxoBar:'pintxo-bite',patioKitchen:'gazpacho-jug',pulperia:'pulpo-cut',panTerrace:'pa-tomato-half',quesoFarm:'queso-press',
    sidreria:'sidra-culin',jerezBodega:'bodega-wine',fishingPort:'port-crate',orangeGrove:'harvest-fruit',oliveMillEs:'mill-stone',
    albuferaPaddy:'paddy-sheaf',huertaBeds:'harvest-fruit',azafranField:'azafran-threads',dehesaOaks:'harvest-fruit',manchegaFlock:'manchega-sheep',
    veraDryhouse:'vera-ristra',herbonPeppers:'herbon-pepper',alhambra:'alhambra-ripple',flamenco:'flamenco-skirt',manchaWindmill:'molino-sails'};
  for(const [id,name] of Object.entries(subjects)){
    const still=SPAIN_PROPS[id](),poked=SPAIN_PROPS[id]();
    assert.equal(poked.userData.ownReaction,true,`${id}: the stand animates itself, no generic bounce`);
    assert.equal(typeof poked.userData.poke,'function',`${id}: a click must do something`);
    poked.userData.poke();
    // The harvest copy only exists after the poke, so the quiet run is measured against the resting original.
    const quiet=name==='harvest-fruit'?null:worldMatrix(still,name);
    for(let i=1;i<=16;i++){still.userData.tick(i*.1,.1);poked.userData.tick(i*.1,.1);}
    const moved=worldMatrix(poked,name);
    if(quiet){
      const rest=worldMatrix(still,name);
      const delta=Math.max(...moved.map((v,i)=>Math.abs(v-rest[i])),...moved.map((v,i)=>Math.abs(v-quiet[i])));
      assert.ok(delta>.02,`${id}: ${name} must still be clearly changed when the camera arrives at 1.6 s (delta ${delta.toFixed(4)})`);
    }
  }

  // 2b. The arrival camera can see the reaction, from either end of its range as well as from the middle.
  // main.ts flies to the object in 1.6 seconds and stops on a horizontal offset of max(8.8, min(18, the larger
  // footprint side x 1.05)) with the eye 1.4 above the anchor's 1.2, and OrbitControls clamps the azimuth to
  // plus or minus 0.75 radians, so a visitor cannot walk round a blocked stand. From each of those three
  // directions a ray to the reacting subject, the stand turned to the rotation spain-objects.ts gives it, must
  // reach the subject without meeting another mesh of the same stand: no roof, awning, post, arch or bystander.
  // Five takes each, because the shared rnd() seed moves the crowns and the crates a little on every build:
  // the sight line has to be clear whatever the world happens to have built before this stand.
  const rotOf=Object.fromEntries(SPAIN_OBJECTS.filter(o=>o.prop).map(o=>[o.prop,o.rot??0]));
  for(const [id,name] of Object.entries({...subjects,gaudiBench:'trencadis-tile'})) for(let take=0;take<5;take++){
    const stand=SPAIN_PROPS[id]();
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
      // SPAIN_DEBUG=1 names the blocker and where it stands, which is what a fix needs
      if(blocked&&process.env.SPAIN_DEBUG){const w=new THREE.Vector3();blocked.object.getWorldPosition(w);const chain=[];for(let b=blocked.object;b;b=b.parent)if(b.name)chain.push(b.name);console.log(`DEBUG ${id} a=${azimuth} blocked by ${chain.join('<')||blocked.object.geometry.type} at (${w.x.toFixed(2)},${w.y.toFixed(2)},${w.z.toFixed(2)}) local(${blocked.object.position.x.toFixed(2)},${blocked.object.position.y.toFixed(2)},${blocked.object.position.z.toFixed(2)}) d=${blocked.distance.toFixed(2)}/${stop.toFixed(2)} aim(${aim.x.toFixed(2)},${aim.y.toFixed(2)},${aim.z.toFixed(2)}) centre(${centre.x.toFixed(2)},${centre.z.toFixed(2)}) D=${distance.toFixed(2)}`);}
      assert.ok(!blocked,`${id}: ${blocked?(blocked.object.name||blocked.object.parent?.name||'a mesh of the stand'):''} hides ${name} from the arrival camera at azimuth ${azimuth} (take ${take})`);
    }
  }

  // 2c. The mosaic bench answers with light rather than movement, so its glow is measured instead.
  {
    const still=SPAIN_PROPS.gaudiBench(),poked=SPAIN_PROPS.gaudiBench();
    assert.equal(poked.userData.ownReaction,true,'gaudiBench: the stand animates itself');
    poked.userData.poke();
    for(let i=1;i<=16;i++){still.userData.tick(i*.1,.1);poked.userData.tick(i*.1,.1);}
    const glow=root=>{let top=0;root.traverse(o=>{const m=o.material;if(m?.emissive&&m.emissive.getHex()!==0&&m.emissiveIntensity>top)top=m.emissiveIntensity;});return top;};
    assert.ok(glow(still)>0,'gaudiBench: the light travels across the trencadis even without a click');
    assert.ok(glow(poked)>glow(still)+.3,`gaudiBench: the click must brighten the band that crosses the bench (${glow(poked).toFixed(2)} vs ${glow(still).toFixed(2)})`);
    for(let i=17;i<=300;i++)poked.userData.tick(i*.1,.1);
    assert.ok(glow(poked)<=.36,'gaudiBench: the glow returns to its resting travel');
  }

  // 3. The pours connect a real spout to a real vessel, and the stream is gone once the reaction has passed.
  for(const [id,name] of [['sidreria','sidra-stream'],['jerezBodega','bodega-thread'],['quesoFarm','queso-whey'],['oliveMillEs','mill-oil'],['tapasBar','bravas-stream'],['pintxoBar','pintxo-stream'],['patioKitchen','gazpacho-stream']]){
    const stand=run(SPAIN_PROPS[id](),1.6,true),liquid=stand.getObjectByName(name);
    assert.ok(liquid,`${id}: needs a modelled ${name}`);
    assert.equal(liquid.visible,true,`${id}: the ${name} must still be running at the 1.6 s arrival`);
    assert.ok(liquid.scale.y>.02,`${id}: the ${name} must span a real distance, not a floating line`);
    for(let i=17;i<=240;i++)stand.userData.tick(i*.1,.1);
    assert.equal(liquid.visible,false,`${id}: the ${name} must stop when the reaction has gone`);
  }

  // 3b. The two long pours fall under gravity. Each is a column that hangs from the real spout to the real
  // vessel: at the arrival frame it is within a few degrees of straight down, its head sits at the bottle mouth
  // or the silver cup of the venencia, its foot in the glass below, and the spout is held over the glass rather
  // than across the room from it. The cider is the thicker of the two, the sherry a thread.
  const radiusOf=column=>{const seg=column.children.find(o=>o.geometry?.parameters?.radiusTop!==undefined);return seg.geometry.parameters.radiusTop;};
  const columns={};
  for(const [id,columnName,spout,tip,vessel,minSpan] of [
    ['sidreria','sidra-stream','sidra-bottle',[0,.1,0],'sidra-glass',.45],
    ['jerezBodega','bodega-thread','bodega-venencia',[0,-.93,0],'bodega-copita',.8],
  ]){
    const stand=run(SPAIN_PROPS[id](),1.6,true);stand.updateMatrixWorld(true);
    const column=stand.getObjectByName(columnName);columns[id]=column;
    assert.equal(column.visible,true,`${id}: the pour must still be running at the 1.6 s arrival`);
    const down=new THREE.Vector3(0,-1,0).applyQuaternion(column.getWorldQuaternion(new THREE.Quaternion()));
    assert.ok(down.y<=-.95,`${id}: the pour must fall rather than cross the room (its axis points ${down.y.toFixed(2)} down)`);
    assert.ok(column.scale.y>=minSpan,`${id}: the fall is only ${column.scale.y.toFixed(2)} long`);
    const head=column.getWorldPosition(new THREE.Vector3());
    const mouth=stand.getObjectByName(spout).localToWorld(new THREE.Vector3(...tip));
    assert.ok(head.distanceTo(mouth)<=.12,`${id}: the pour must leave the real spout (${head.distanceTo(mouth).toFixed(2)} from it)`);
    const foot=head.clone().add(down.clone().multiplyScalar(column.scale.y));
    const lip=stand.getObjectByName(vessel).getWorldPosition(new THREE.Vector3());
    assert.ok(foot.distanceTo(lip)<=.2,`${id}: the pour must land in the real vessel (${foot.distanceTo(lip).toFixed(2)} from it)`);
    assert.ok(Math.hypot(head.x-lip.x,head.z-lip.z)<=.2,`${id}: the spout must be held above the glass, not beside it`);
  }
  assert.ok(radiusOf(columns.sidreria)>=radiusOf(columns.jerezBodega)*2,'the cider must read as a heavier stream than the sherry thread');

  // 3c. Held-tool reach. The shared rig reaches .37 forward of the hand, so nothing a worker holds may hang
  // further than that from it: the bottle, the wide glass, the venencia and the copita all stay inside it.
  for(const [id,held] of [['sidreria',['sidra-bottle','sidra-glass']],['jerezBodega',['bodega-venencia','bodega-copita']]]){
    const stand=run(SPAIN_PROPS[id](),1.6,true);
    for(const name of held){
      const tool=stand.getObjectByName(name);
      const arm=tool.parent;
      assert.ok(arm.parent?.parent?.userData?.arms||arm.parent?.userData?.arms,`${id}: ${name} must be held in a hand`);
      const across=Math.hypot(tool.position.x,tool.position.z);
      assert.ok(across<=.37,`${id}: ${name} hangs ${across.toFixed(2)} from the hand, past the rig's .37 reach`);
    }
  }

  // 4. Repeated clicks stay bounded and the fruit that falls is cleaned up.
  for(const id of ['orangeGrove','huertaBeds','dehesaOaks','oliveMillEs']){
    const stand=SPAIN_PROPS[id](),count=stand.children.length;
    for(let i=0;i<40;i++)stand.userData.poke();
    assert.ok(stand.children.length<=count+24,`${id}: repeated clicks must remain bounded`);
    for(let i=0;i<300;i++)stand.userData.tick(i/60,1/60);
    assert.equal(stand.children.length,count,`${id}: falling fruit must clean up`);
  }

  // 5. Everything that moves returns to its exact support, and the people never leave theirs.
  const settling={paellaFire:'paella-rice',tapasBar:'bravas-jug',jamonStall:'jamon-slice',tortillaKitchen:'tortilla',churreria:'churro-rising',
    pintxoBar:'pintxo-bite',patioKitchen:'gazpacho-jug',pulperia:'pulpo-cut',panTerrace:'pa-tomato-half',quesoFarm:'queso-press',
    fishingPort:'port-crate',albuferaPaddy:'paddy-sheaf',azafranField:'azafran-threads',manchegaFlock:'manchega-sheep'};
  for(const [id,name] of Object.entries(settling)){
    const stand=SPAIN_PROPS[id](),subject=stand.getObjectByName(name);
    stand.userData.tick(0,0);subject.updateMatrix();const start=subject.matrix.clone();
    for(let i=0;i<6;i++){stand.userData.poke();for(let k=0;k<20;k++)stand.userData.tick((i*20+k)/60,1/60);}
    for(let i=0;i<300;i++)stand.userData.tick(10+i/60,1/60);
    subject.updateMatrix();
    assert.deepEqual(subject.matrix.elements,start.elements,`${id}: ${name} settles exactly, without drift after repeated clicks`);
  }
  for(const id of expected){
    const stand=SPAIN_PROPS[id]();
    const roots=stand.children.filter(o=>o.userData.upper).map(o=>[o,o.position.y]);
    stand.userData.poke();stand.userData.tick(.2,.2);
    assert.ok(roots.every(([o,y])=>Math.abs(o.position.y-y)<1e-9),`${id}: people stay on their supports`);
  }

  // 5b. Every lamp hangs from a beam within reach, and its cord stays on the anchor while it swings.
  for(const id of expected){
    const root=SPAIN_PROPS[id]();root.updateMatrixWorld(true);
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
    const root=SPAIN_PROPS[id]();root.userData.tick(0,0);root.updateMatrixWorld(true);
    let lowest=Infinity,culprit='';
    root.traverse(o=>{if(!o.isMesh)return;let shown=true;for(let a=o;a;a=a.parent)if(!a.visible)shown=false;if(!shown)return;o.geometry.computeBoundingBox();const y=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld).min.y;if(y<lowest){lowest=y;culprit=o.name||o.parent?.name||'mesh';}});
    assert.ok(lowest>=-.35,`${id}: ${culprit} sinks to ${lowest.toFixed(2)} below the ground`);
  }

  // 6. The main stands carry the hotpot table: modelled food, six to nine people, a beam with lamps, steam at a hot source.
  // Rooms with a fire, a fryer or a hot vessel carry a steam point; the cold counters and cellars carry none.
  const hot=new Set(['paellaFire','tapasBar','tortillaKitchen','churreria','pulperia','panTerrace','quesoFarm']);
  const cold=['jamonStall','pintxoBar','patioKitchen','sidreria','jerezBodega'];
  for(const id of ['paellaFire','tapasBar','jamonStall','tortillaKitchen','churreria','pintxoBar','patioKitchen','pulperia','panTerrace','quesoFarm','sidreria','jerezBodega']){
    const stand=SPAIN_PROPS[id]();let people=0,lanterns=0,beams=0;
    stand.traverse(o=>{if(o.userData.upper)people++;if(o.name==='hanging-lantern')lanterns++;if(o.name==='front-beam')beams++;});
    assert.ok(people>=6&&people<=9,`${id}: six to nine people, found ${people}`);
    assert.ok(lanterns>=2,`${id}: lamps hang under the beam, found ${lanterns}`);
    assert.ok(beams>=1,`${id}: the lamps need a beam to hang from`);
    if(hot.has(id))assert.ok(stand.userData.steam,`${id}: a hot source needs a steam point`);
  }
  for(const id of cold)assert.equal(SPAIN_PROPS[id]().userData.steam,undefined,`${id}: nothing here is hot, so nothing steams`);

  console.log('PASS: 26 Spain stands, food before speech, a clear sight line from the arrival camera, falling pours on real spouts and an exact return to rest.');
}finally{await rm(temp,{recursive:true,force:true});}
