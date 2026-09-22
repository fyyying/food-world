/**
 * Thailand stands: the click chain, the 1.6-second camera arrival, bounded repeats and a clean return to rest.
 * Copied from spain-reactions.mjs with the Thai ids of docs/thailand-world.md, and carrying the frame check the
 * Vietnam harness added: a subject that is unblocked but above the arrival lens is still not on the screen.
 *
 * The Researcher's `thailand-objects.ts` has landed, so the sight line is measured with every stand turned to the
 * rotation the fixed blueprint gives it rather than at rotation 0. The four market stall boats carry no rotation
 * of their own, because their objects are still the hit-only children `graph.ts` has today; they are measured
 * square to the basin, which is how the blueprint moors them.
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
const temp=await mkdtemp(join(tmpdir(),'thailand-reactions-'));
try{
  await build({input:{props:'src/fw/props-thailand.ts',objects:'src/fw/thailand-objects.ts'},platform:'node',output:{dir:temp,format:'esm',entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs',banner:'import.meta.env={VITE_STATIC:"1",BASE_URL:"/"};'}});
  const props=await import(pathToFileURL(join(temp,'props.mjs')));
  const {THAILAND_PROPS,THAILAND_ICONS,TH_LINES}=props;
  const {THAILAND_OBJECTS}=await import(pathToFileURL(join(temp,'objects.mjs')));

  // 0. Every prop name in the Thailand object list has a stand, and nothing else is exported as one.
  const rooms=['floatingMarket','noodleBoat','wangKitchen','curryKitchen','khanomKitchen','shophouseTh',
    'fieldLunch','isanGrill','lannaKitchen','andamanKitchen','muslimKitchen','babaKitchen'];
  const stalls=['stallFruitBoat','stallNoodleBoat','stallHerbBoat','stallCoconutBoat'];
  const stops=['spiceStall','coconutSea','paddyTh','fishTraps','riverOrchard','sugarPalms','saltPans','plaRaYard','miangGrove','turmericBeds'];
  const landmarks=['wat','almsRound','karst','mokenBoat','rickshaw','muleCaravan'];
  const expected=[...rooms,...stalls,...stops,...landmarks];
  assert.deepEqual(Object.keys(THAILAND_PROPS).sort(),[...expected].sort(),'THAILAND_PROPS holds one stand per prop name in docs/thailand-world.md');
  assert.equal(expected.length,32,'32 stands: 12 rooms, 4 market stall boats, 10 ingredient stops, 6 landmarks');
  // The owner's three recastings: no longtail boat, no motorised tuk-tuk, and the market keeps its room.
  assert.ok(!THAILAND_PROPS.longtail&&!THAILAND_PROPS.tukTuk,'the longtail and the motor tuk-tuk are out of the 1880-1910 band and were recast');
  assert.equal(typeof props.kabang,'function','the sea people’s kabang is exported for the Builder’s decor');
  assert.equal(typeof props.rickshaw,'function','the pulled rickshaw is exported for the Builder’s road decor');
  assert.equal(typeof props.oxCart,'function','the ox cart is exported for the Isan track');
  assert.equal(typeof props.noodleBoat,'function','the noodle boat is a prop name and an exported builder');

  // 0b. The object list and this file agree. Twenty-eight objects name a prop and every one of them is built
  // here; the four market stalls are still the hit-only children `graph.ts` has today, so they carry
  // `prop: "none"` and their boats wait in `THAILAND_PROPS` for the Stage D registration that frees them.
  assert.equal(THAILAND_OBJECTS.length,32,'the object list carries the same thirty-two objects');
  const stallObjects=THAILAND_OBJECTS.filter(o=>o.parent==='floatingMarket');
  assert.equal(stallObjects.length,4,'the floating market has four stall children');
  for(const o of THAILAND_OBJECTS){
    if(o.prop==='none'){assert.ok(stallObjects.includes(o),`${o.id}: only the four market stalls may carry no prop of their own`);continue;}
    assert.ok(typeof THAILAND_PROPS[o.prop]==='function',`${o.id}: no builder in THAILAND_PROPS for prop \`${o.prop}\``);
  }
  assert.deepEqual([...new Set(THAILAND_OBJECTS.map(o=>o.prop).filter(p=>p!=='none'))].sort(),[...rooms,...stops,...landmarks].sort(),
    'the twenty-eight props the object list names are exactly the twenty-eight stands, stalls aside');

  // 0c. Nothing outside the 1880-1910 band is built. The owner recast the longtail onto the kabang and the
  // tuk-tuk onto the pulled rickshaw, and the Andaman coast is a working beach: no lounger, no parasol. Only
  // the object ids `longtail` and `tukTuk` survive, as the speech keys of the two recast stands, and comments
  // may say what was removed, so the grep runs over the code with its comments stripped.
  const source=await readFile('src/fw/props-thailand.ts','utf8');
  const code=source.replace(/\/\*[\s\S]*?\*\//g,'').split('\n').map(l=>l.replace(/(^|[^:"'`])\/\/.*$/,'$1'));
  for(const [what,pattern] of [['a tuk-tuk',/tuk[\s-]?tuk/i],['a motorbike',/motorbik|motorcycle|scooter/i],['a longtail boat',/long[\s-]?tail/i],['a lounger',/lounger|deck ?chair/i],['a parasol',/parasol|sun ?umbrella/i]]){
    const hits=code.map((l,i)=>[i+1,l]).filter(([,l])=>pattern.test(l)&&!/life\(g, ?"(longtail|tukTuk)"/.test(l));
    assert.equal(hits.length,0,`props-thailand.ts builds ${what}, which is out of the 1880-1910 band: line ${hits[0]?.[0]} ${hits[0]?.[1]?.trim()}`);
  }

  // 0d. The owner's two recasts are built the way the ruling describes them, not renamed in place. The sea
  // people's kabang is a dug-out under a palm-thatch roof that rides its mooring with a child aboard, and the
  // rickshaw is pulled by a man between two shafts on two spoked wheels.
  {
    const boat=props.kabang(0,true);
    assert.ok(boat.getObjectByName('kabang-roof'),'the kabang carries a palm-thatch roof over the middle');
    assert.ok(boat.getObjectByName('kabang-child'),'a child of the household rides the kabang');
    const hull=boat.userData.boat, restY=hull.position.y, restZ=hull.rotation.z;
    boat.userData.tick(1.1,.016);
    assert.ok(Math.abs(hull.position.y-restY)+Math.abs(hull.rotation.z-restZ)>1e-4,'the kabang rides the swell on its mooring');
    const car=props.rickshaw(true);
    assert.ok(car.getObjectByName('rickshaw-hood'),'the rickshaw has a folding hood');
    assert.ok(car.getObjectByName('rickshaw-puller'),'the rickshaw is pulled by a man in the shafts, not driven');
    assert.equal(car.userData.wheels.length,2,'two wheels and no engine');
    assert.equal(car.userData.shafts.length,2,'two shafts for the puller to lean into');
  }

  // 1. Every room object carries a card badge, and every one of the thirty-two objects has ambient speech.
  const roomIds=['floatingMarket','kuaitiaoRuea','wangKitchenTh','curryPaste','sweetsTh','shophouseTh','naKhaoTh','isanGrillTh','khaoSoiTh','talayTh','muslimKitchenTh','babaTh'];
  for(const id of [...roomIds,'stall-fruit','stall-noodles']){
    assert.ok(typeof THAILAND_ICONS[id]==='function',`${id}: needs a rendered card badge`);
    assert.ok(THAILAND_ICONS[id]().children.length>0,`${id}: the badge must model something`);
  }
  const stopIds=['chilliesSea','coconutSea','naPaddyTh','plaTh','suanTh','tanTh','kluaTh','plaRaTh','miangTh','khamminTh'];
  const landmarkIds=['wat','almsRound','karsts','longtail','tukTuk','chinHawTh'];
  const ids=[...roomIds,...stopIds,...landmarkIds];
  assert.equal(ids.length,28,'12 rooms, 10 ingredient stops and 6 landmarks carry ambient speech');
  for(const id of ids){
    const lines=TH_LINES[id];
    assert.ok(Array.isArray(lines)&&lines.length>=4&&lines.length<=8,`${id}: four to eight ambient speech lines, found ${lines?.length}`);
    // The local phrase and its English come on one line, either side of a middle dot, as research 2.5 writes them.
    for(const line of lines) assert.ok(/\S\s·\s\S/.test(line)&&/[A-Za-z]/.test(line.split(' · ')[1]??''),`${id}: "${line}" must carry the local language and English on one line`);
  }
  assert.equal(Object.keys(TH_LINES).length,28,'TH_LINES, the Researcher\u2019s file, covers the twenty-eight card objects');
  // The four market stall boats have no key of their own, so each speaks with the voice of the boat beside it.
  // A stall that fell back to the builder default would say "Hello" and nothing else, which is what this catches.
  for(const id of ['stallFruitBoat','stallNoodleBoat','stallHerbBoat','stallCoconutBoat']){
    const stand=THAILAND_PROPS[id]();
    stand.userData.poke();stand.userData.tick(.1,.1);stand.userData.tick(.5,.4);
    let said='';stand.traverse(o=>{if(o.element?.className==='bubble')said=o.element.textContent??'x';});
    assert.ok(said&&said!=='\u0e2a\u0e27\u0e31\u0e2a\u0e14\u0e35 \u00b7 Hello.',`${id}: a stall boat must speak with the market's own lines, not the builder default`);
  }

  const bubbleCount=root=>{let count=0;root.traverse(o=>{if(o.element?.className==='bubble')count++;});return count;};
  const worldMatrix=(root,name)=>{const o=root.getObjectByName(name);assert.ok(o,`missing named reacting subject ${name}`);root.updateMatrixWorld(true);return o.matrixWorld.elements.slice();};
  const run=(stand,seconds,poke)=>{if(poke)stand.userData.poke();for(let i=1;i<=Math.round(seconds/.1);i++)stand.userData.tick(i*.1,.1);return stand;};

  // 2. The food moves before anyone speaks, and the speech arrives after the physical response.
  const ordered=props.floatingMarket(),top=ordered.getObjectByName('market-coconut-top'),topY=top.position.y;
  ordered.userData.poke();assert.equal(bubbleCount(ordered),0,'speech waits for the cleaver');
  ordered.userData.tick(.1,.1);assert.notEqual(top.position.y,topY,'the coconut top lifts on the first reaction frame');
  assert.equal(bubbleCount(ordered),0,'speech stays subordinate during the first beat');
  ordered.userData.tick(.4,.3);assert.equal(bubbleCount(ordered),1,'speech follows the physical response');

  // 3. Every stand owns its reaction, and its named subject is still visibly changed when the camera arrives at 1.6 s.
  const subjects={
    floatingMarket:'market-coconut-top',noodleBoat:'noodle-ladle',wangKitchen:'wang-chilli-flower',curryKitchen:'curry-paste',
    khanomKitchen:'khanom-cone',shophouseTh:'shophouse-noodles',fieldLunch:'paddy-banana-leaf',isanGrill:'isan-papaya',
    lannaKitchen:'lanna-sai-ua',andamanKitchen:'andaman-fish',muslimKitchen:'muslim-roti',babaKitchen:'baba-tiffin',
    stallFruitBoat:'stall-durian',stallNoodleBoat:'stall-bowl',stallHerbBoat:'stall-lemongrass',stallCoconutBoat:'stall-coconut-roll',
    spiceStall:'spice-scoop',coconutSea:'harvest-fruit',paddyTh:'paddy-furrow',fishTraps:'fish-trap',riverOrchard:'harvest-fruit',
    sugarPalms:'palm-cylinder',saltPans:'salt-cone',plaRaYard:'plara-lid',miangGrove:'miang-lid',turmericBeds:'turmeric-root',
    wat:'wat-bell',almsRound:'alms-rice',karst:'karst-flash',mokenBoat:'kabang-roof',rickshaw:'rickshaw-hood',muleCaravan:'caravan-pannier'};
  assert.deepEqual(Object.keys(subjects).sort(),[...expected].sort(),'every stand names the subject that answers a click');
  for(const [id,name] of Object.entries(subjects)){
    const still=THAILAND_PROPS[id](),poked=THAILAND_PROPS[id]();
    assert.equal(poked.userData.ownReaction,true,`${id}: the stand animates itself, no generic bounce`);
    assert.equal(typeof poked.userData.poke,'function',`${id}: a click must do something`);
    poked.userData.poke();
    const quiet=name==='harvest-fruit'?null:worldMatrix(still,name);
    for(let i=1;i<=16;i++){still.userData.tick(i*.1,.1);poked.userData.tick(i*.1,.1);}
    const moved=worldMatrix(poked,name);
    if(quiet){
      const rest=worldMatrix(still,name);
      const delta=Math.max(...moved.map((v,i)=>Math.abs(v-rest[i])),...moved.map((v,i)=>Math.abs(v-quiet[i])));
      assert.ok(delta>.02,`${id}: ${name} must still be clearly changed when the camera arrives at 1.6 s (delta ${delta.toFixed(4)})`);
    }
  }

  // 3b. The arrival camera can see the reaction, from either end of its range as well as from the middle.
  // main.ts flies to the object in 1.6 seconds and stops on a horizontal offset of max(8.8, min(18, the larger
  // footprint side x 1.05)) with the eye 1.4 above the anchor's 1.2, and OrbitControls clamps the azimuth to
  // plus or minus 0.75 radians. From each of those three directions a ray to the reacting subject, the stand
  // turned to the rotation thailand-objects.ts gives it, must reach it without meeting another mesh of the same
  // stand: no roof, shade, post, boat, beam or bystander. And the subject has to be inside the 34-degree lens as
  // well as unblocked, because a thing above the roofline is off the top of the screen when the flight ends.
  // Five takes each, because the shared rnd() seed moves the crowns and the figures a little on every build.
  const rotOf=Object.fromEntries(THAILAND_OBJECTS.filter(o=>o.prop&&o.prop!=='none').map(o=>[o.prop,o.rot??0]));
  for(const [id,name] of Object.entries(subjects)) for(let take=0;take<5;take++){
    const stand=THAILAND_PROPS[id]();
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
      // THAILAND_DEBUG=1 names the blocker and where it stands, which is what a fix needs
      if(blocked&&process.env.THAILAND_DEBUG){const w=new THREE.Vector3();blocked.object.getWorldPosition(w);const chain=[];for(let b=blocked.object;b;b=b.parent)if(b.name)chain.push(b.name);console.log(`DEBUG ${id} a=${azimuth} blocked by ${chain.join('<')||blocked.object.geometry.type} at (${w.x.toFixed(2)},${w.y.toFixed(2)},${w.z.toFixed(2)}) local(${blocked.object.position.x.toFixed(2)},${blocked.object.position.y.toFixed(2)},${blocked.object.position.z.toFixed(2)}) d=${blocked.distance.toFixed(2)}/${stop.toFixed(2)} aim(${aim.x.toFixed(2)},${aim.y.toFixed(2)},${aim.z.toFixed(2)}) centre(${centre.x.toFixed(2)},${centre.z.toFixed(2)}) D=${distance.toFixed(2)}`);}
      assert.ok(!blocked,`${id}: ${blocked?(blocked.object.name||blocked.object.parent?.name||'a mesh of the stand'):''} hides ${name} from the arrival camera at azimuth ${azimuth} (take ${take})`);
      // main.ts looks through a 34-degree lens aimed at the anchor, so a subject much above the roofline — a
      // chedi's gold, a bell, a lamp on a stage — is out of the picture even with nothing in front of it.
      const lens=new THREE.PerspectiveCamera(34,16/9,.1,400);
      lens.position.copy(eye);lens.lookAt(centre.x,1.2,centre.z);lens.updateMatrixWorld(true);
      const frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(lens.projectionMatrix,lens.matrixWorldInverse));
      assert.ok(frustum.containsPoint(aim),`${id}: ${name} is outside the 34-degree arrival frame at azimuth ${azimuth} (aim y ${aim.y.toFixed(2)})`);
    }
  }

  // 3c. The wat answers with light as well as movement, so its gold is measured too.
  {
    const still=THAILAND_PROPS.wat(),poked=THAILAND_PROPS.wat();
    poked.userData.poke();
    for(let i=1;i<=16;i++){still.userData.tick(i*.1,.1);poked.userData.tick(i*.1,.1);}
    const glow=root=>{let top=0;root.traverse(o=>{const m=o.material;if(m?.emissive&&m.emissive.getHex()!==0&&m.emissiveIntensity>top)top=m.emissiveIntensity;});return top;};
    assert.ok(glow(poked)>glow(still)+.3,`wat: the click must make the chedi’s gold catch (${glow(poked).toFixed(2)} vs ${glow(still).toFixed(2)})`);
    for(let i=17;i<=300;i++)poked.userData.tick(i*.1,.1);
    assert.ok(glow(poked)<=glow(still)+1e-6,'wat: the gold returns to its resting light');
  }

  // 4. The pours connect a real spout to a real vessel, and the stream is gone once the reaction has passed.
  for(const [id,name] of [['floatingMarket','market-coconut-water'],['noodleBoat','noodle-broth'],['sugarPalms','palm-toddy']]){
    const stand=run(THAILAND_PROPS[id](),1.6,true),liquid=stand.getObjectByName(name);
    assert.ok(liquid,`${id}: needs a modelled ${name}`);
    assert.equal(liquid.visible,true,`${id}: the ${name} must still be running at the 1.6 s arrival`);
    assert.ok(liquid.scale.y>.02,`${id}: the ${name} must span a real distance, not a floating line`);
    for(let i=17;i<=240;i++)stand.userData.tick(i*.1,.1);
    assert.equal(liquid.visible,false,`${id}: the ${name} must stop when the reaction has gone`);
  }

  // 4b. Each pour falls under gravity from a real lip into a real vessel, rather than crossing the stand.
  for(const [id,columnName,vessel,maxGap] of [
    ['floatingMarket','market-coconut-water','market-cup',.22],
    ['noodleBoat','noodle-broth','noodle-bowl',.26],
    ['sugarPalms','palm-toddy','palm-syrup',.34],
  ]){
    const stand=run(THAILAND_PROPS[id](),1.6,true);stand.updateMatrixWorld(true);
    const column=stand.getObjectByName(columnName);
    const down=new THREE.Vector3(0,-1,0).applyQuaternion(column.getWorldQuaternion(new THREE.Quaternion()));
    assert.ok(down.y<=-.80,`${id}: the pour must fall rather than cross the stand (its axis points ${down.y.toFixed(2)} down)`);
    const head=column.getWorldPosition(new THREE.Vector3());
    const foot=head.clone().add(down.clone().multiplyScalar(column.scale.y));
    const lip=stand.getObjectByName(vessel).getWorldPosition(new THREE.Vector3());
    assert.ok(foot.distanceTo(lip)<=maxGap,`${id}: the pour must land in the real vessel (${foot.distanceTo(lip).toFixed(2)} from it)`);
  }

  // 5. Repeated clicks stay bounded and the fruit that falls is cleaned up.
  for(const id of ['coconutSea','riverOrchard']){
    const stand=THAILAND_PROPS[id](),count=stand.children.length;
    for(let i=0;i<40;i++)stand.userData.poke();
    assert.ok(stand.children.length<=count+24,`${id}: repeated clicks must remain bounded`);
    for(let i=0;i<300;i++)stand.userData.tick(i/60,1/60);
    assert.equal(stand.children.length,count,`${id}: falling fruit must clean up`);
  }

  // 6. Everything that moves returns to its exact support, and the people never leave theirs.
  const settling={floatingMarket:'market-coconut-top',noodleBoat:'noodle-ladle',wangKitchen:'wang-chilli-flower',
    curryKitchen:'curry-paste',shophouseTh:'shophouse-noodles',fieldLunch:'paddy-banana-leaf',isanGrill:'isan-papaya',
    andamanKitchen:'andaman-fish',babaKitchen:'baba-tiffin',stallNoodleBoat:'stall-bowl',stallHerbBoat:'stall-lemongrass',
    spiceStall:'spice-scoop',fishTraps:'fish-trap',sugarPalms:'palm-cylinder',saltPans:'salt-cone',plaRaYard:'plara-lid',
    miangGrove:'miang-lid',turmericBeds:'turmeric-root',mokenBoat:'kabang-roof',rickshaw:'rickshaw-hood'};
  for(const [id,name] of Object.entries(settling)){
    const stand=THAILAND_PROPS[id](),subject=stand.getObjectByName(name);
    stand.userData.tick(0,0);subject.updateMatrix();const start=subject.matrix.clone();
    for(let i=0;i<6;i++){stand.userData.poke();for(let k=0;k<20;k++)stand.userData.tick((i*20+k)/60,1/60);}
    for(let i=0;i<300;i++)stand.userData.tick(10+i/60,1/60);
    subject.updateMatrix();
    assert.deepEqual(subject.matrix.elements,start.elements,`${id}: ${name} settles exactly, without drift after repeated clicks`);
  }
  for(const id of expected){
    const stand=THAILAND_PROPS[id]();
    const roots=[];stand.traverse(o=>{if(o.userData.upper)roots.push([o,o.position.y]);});
    stand.userData.poke();stand.userData.tick(.2,.2);
    assert.ok(roots.every(([o,y])=>Math.abs(o.position.y-y)<1e-9),`${id}: people stay on their supports`);
  }

  // 6b. Every lamp hangs from a beam within reach, and its cord stays on the anchor while it swings.
  let lampCount=0;
  for(const id of expected){
    const root=THAILAND_PROPS[id]();root.updateMatrixWorld(true);
    const meshes=[],lanterns=[];
    root.traverse(o=>{if(o.isMesh)meshes.push(o);if(o.name==='hanging-lantern')lanterns.push(o);});
    for(const lantern of lanterns){
      lampCount++;
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

  // 6c. Nothing sinks through the ground or the water the stand stands on.
  for(const id of expected){
    const root=THAILAND_PROPS[id]();root.userData.tick(0,0);root.updateMatrixWorld(true);
    let lowest=Infinity,culprit='';
    root.traverse(o=>{if(!o.isMesh)return;let shown=true;for(let a=o;a;a=a.parent)if(!a.visible)shown=false;if(!shown)return;o.geometry.computeBoundingBox();const y=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld).min.y;if(y<lowest){lowest=y;culprit=o.name||o.parent?.name||'mesh';}});
    assert.ok(lowest>=-.35,`${id}: ${culprit} sinks to ${lowest.toFixed(2)} below the ground`);
  }

  // 7. The twelve room stands carry the hotpot table: six to nine people, a beam with lamps, steam at a hot source.
  // The khlong market and the floating stalls are cold counters of fruit, herbs and raw coconut and carry none.
  const hot=new Set(['noodleBoat','wangKitchen','curryKitchen','khanomKitchen','shophouseTh','isanGrill','lannaKitchen','muslimKitchen','babaKitchen']);
  const cold=['floatingMarket','fieldLunch','andamanKitchen'];
  for(const id of rooms){
    const stand=THAILAND_PROPS[id]();let people=0,lanterns=0,beams=0;
    stand.traverse(o=>{if(o.userData.upper)people++;if(o.name==='hanging-lantern')lanterns++;if(o.name==='front-beam')beams++;});
    assert.ok(people>=6&&people<=9,`${id}: six to nine people, found ${people}`);
    assert.ok(lanterns>=2,`${id}: lamps hang under the beam, found ${lanterns}`);
    assert.ok(beams>=1,`${id}: the lamps need a beam to hang from`);
    if(hot.has(id))assert.ok(stand.userData.steam,`${id}: a hot source needs a steam point`);
  }
  // The two open fires carry smoke rather than steam: a leaf-wrapped fish and a green-stick grill are not boiled.
  for(const id of cold){const stand=THAILAND_PROPS[id]();if(id!=='floatingMarket')assert.ok(stand.userData.smoke,`${id}: an open fire carries smoke`);assert.equal(stand.userData.steam,undefined,`${id}: nothing here is boiled, so nothing steams`);}

  // 8. The ingredient stops and the landmarks are not empty: each models something and carries two or more people.
  for(const id of [...stalls,...stops,...landmarks]){
    const stand=THAILAND_PROPS[id]();let meshes=0,people=0;
    stand.traverse(o=>{if(o.isMesh)meshes++;if(o.userData.upper)people++;});
    assert.ok(meshes>=40,`${id}: an ingredient stop or landmark still needs a real prop, found ${meshes} meshes`);
    assert.ok(people>=2,`${id}: someone has to be there to speak, found ${people}`);
  }

  // 9. Every figure that travels swings its legs in step with the distance it covers, and every main stand has
  // one: the hotpot table asks for a walker on a path that avoids the walls, and a figure that slides fails.
  for(const id of expected){
    const stand=THAILAND_PROPS[id]();
    const figures=[];stand.traverse(o=>{if(o.userData?.legs&&o.userData?.upper)figures.push(o);});
    const start=figures.map(f=>({f,at:f.position.clone(),thigh:f.userData.legs.left.thigh.rotation.x}));
    const travel=new Map(start.map(s=>[s.f,0])), swing=new Map(start.map(s=>[s.f,0]));
    for(let i=1;i<=60;i++){
      stand.userData.tick(20+i*.1,.1);
      for(const s of start){
        travel.set(s.f,Math.max(travel.get(s.f),s.f.position.distanceTo(s.at)));
        swing.set(s.f,Math.max(swing.get(s.f),Math.abs(s.f.userData.legs.left.thigh.rotation.x-s.thigh)));
      }
    }
    let walkers=0;
    for(const s of start){
      if(travel.get(s.f)<.05)continue;
      walkers++;
      assert.ok(swing.get(s.f)>.05,`${id}: a figure covered ${travel.get(s.f).toFixed(2)} units without swinging its legs`);
    }
    if(rooms.includes(id))assert.ok(walkers>=1,`${id}: a main stand needs a walker, and its steps must match the distance`);
  }

  console.log(`PASS: 32 Thailand stands, food before speech, a clear sight line and a place in the 34-degree frame from the arrival camera at three azimuths and the blueprint's own rotations, ${lampCount} lamps on real beams, falling pours on real spouts, legs that match the distance covered, nothing out of the 1880-1910 band and an exact return to rest.`);
}finally{await rm(temp,{recursive:true,force:true});}
